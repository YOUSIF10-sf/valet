import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import puppeteer from "puppeteer-core";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import { findChrome } from "@/lib/findChrome";

export async function POST(request: Request) {
  try {
    const { rows, htmlContent, date } = await request.json();

    if (!htmlContent) {
      return NextResponse.json({ success: false, message: "Missing HTML content" }, { status: 400 });
    }

    // 1. Prepare Base64 Images
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    const sigPath = path.join(process.cwd(), 'public', 'signature.png');
    
    let logoBase64 = "";
    if (fs.existsSync(logoPath)) {
      logoBase64 = `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`;
    }

    let sigBase64 = "";
    if (fs.existsSync(sigPath)) {
      sigBase64 = `data:image/png;base64,${fs.readFileSync(sigPath).toString('base64')}`;
    }

    // Replace image paths with base64 for PDF generation
    let processedHtml = htmlContent;
    if (logoBase64) processedHtml = processedHtml.replace(/\/logo\.png/g, logoBase64);
    if (sigBase64) processedHtml = processedHtml.replace(/\/signature\.png/g, sigBase64);

    // 2. Generate PDF using Puppeteer
    const chromePath = await findChrome();
    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    const fullHtml = `
      <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700;900&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
            body { 
              font-family: 'Noto Sans Arabic', sans-serif; 
              direction: rtl; 
              text-align: right;
            }
            * { direction: rtl !important; }
            .signature-font { 
              font-family: 'Caveat', cursive !important; 
              transform: rotate(-3deg);
            }
          </style>
        </head>
        <body class="bg-white">
          <div class="p-8">
            ${processedHtml}
          </div>
        </body>
      </html>
    `;
    
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' }
    });
    await browser.close();

    // 3. Generate Excel file
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Zaps Operations');
    
    worksheet.columns = [
      { header: 'الفندق', key: 'hotel', width: 20 },
      { header: 'رقم اللوحة', key: 'plate', width: 20 },
      { header: 'المواقف', key: 'parking', width: 15 },
      { header: 'الفاليه (الصف)', key: 'valet', width: 15 },
      { header: 'المجموع', key: 'total', width: 15 },
    ];

    rows.forEach((row: any) => {
      worksheet.addRow({
        hotel: row.hotelId,
        plate: row.plate,
        parking: parseFloat(row.parking) || 0,
        valet: parseFloat(row.valet) || 0,
        total: (parseFloat(row.parking) || 0) + (parseFloat(row.valet) || 0)
      });
    });

    // Formatting
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = { type: 'pattern', pattern:'solid', fgColor:{ argb:'F97316' } };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFF' }, bold: true };

    const excelBuffer = await workbook.xlsx.writeBuffer();

    // 4. Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "easyvaletjo@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"Zaps Quick Reports" <easyvaletjo@gmail.com>',
      to: "jodc.valet@gmail.com",
      subject: `⚡ تقرير ZAPS جديد: ${rows.length} عمليات - ${date}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #f97316;">إشعار تسجيل عمليات ZAPS</h2>
          <p>تم تسجيل <b>${rows.length}</b> عمليات جديدة بنجاح في النظام.</p>
          <div style="background: #fff7ed; padding: 15px; border-radius: 10px; border: 1px solid #ffedd5;">
            <b>التاريخ:</b> ${date}<br/>
            <b>عدد العمليات:</b> ${rows.length}
          </div>
          <p>مرفق طيه كشف المراجعة الرسمي بصيغة PDF وجدول البيانات بصيغة Excel.</p>
          <br/>
          <p>تم التصميم والبرمجة بواسطة ❤️ <b>YOUSIF TARIQ</b></p>
        </div>
      `,
      attachments: [
        { filename: `Zaps_Review_${date}.pdf`, content: pdfBuffer as any },
        { filename: `Zaps_Data_${date}.xlsx`, content: excelBuffer as any }
      ]
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Zaps Email Engine Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
