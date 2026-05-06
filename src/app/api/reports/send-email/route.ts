import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import puppeteer from "puppeteer-core";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import { findChrome } from "@/lib/findChrome"; // We will create this helper

export async function POST(request: Request) {
  try {
    const { reportData, revenueData, reportId, htmlContent } = await request.json();

    if (!htmlContent) {
      return NextResponse.json({ success: false, message: "Missing HTML content" }, { status: 400 });
    }

    // 1. Prepare Base64 Images for Puppeteer
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

    // Replace logo paths with Base64 in the HTML content
    let processedHtml = htmlContent;
    if (logoBase64) processedHtml = processedHtml.replace(/\/logo\.png/g, logoBase64);
    if (sigBase64) processedHtml = processedHtml.replace(/\/signature\.png/g, sigBase64);

    // 2. Generate High-Fidelity PDF using Puppeteer
    const chromePath = await findChrome();
    
    let launchOptions: any = {
      executablePath: chromePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    };

    // If on Vercel, we need specific chromium settings
    if (process.env.VERCEL) {
      const chromium = require('@sparticuz/chromium');
      launchOptions = {
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      };
    }

    const browser = await puppeteer.launch(launchOptions);
    
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
            .print-only { display: block !important; }
            .no-print { display: none !important; }
          </style>
        </head>
        <body class="bg-white">
          ${processedHtml}
        </body>
      </html>
    `;
    
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', bottom: '15mm', left: '10mm', right: '10mm' }
    });
    await browser.close();

    // 3. Generate Professional Excel (Master Design)
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Revenue Analysis');
    sheet.views = [{ rightToLeft: true }];

    // --- Header Section: EASY VALET ---
    sheet.mergeCells('A1:F2');
    const companyHeader = sheet.getCell('A1');
    companyHeader.value = 'EASY VALET';
    companyHeader.font = { name: 'Arial Black', size: 24, color: { argb: 'FF4F46E5' }, bold: true };
    companyHeader.alignment = { horizontal: 'center', vertical: 'middle' };

    sheet.mergeCells('A3:F3');
    const subHeader = sheet.getCell('A3');
    subHeader.value = 'DAILY REVENUE REPORT | تقرير الإيرادات اليومي';
    subHeader.font = { name: 'Arial', size: 10, color: { argb: 'FF94A3B8' }, bold: true };
    subHeader.alignment = { horizontal: 'center' };

    sheet.addRow([]); // Gap

    // --- Report Info ---
    const infoRow = sheet.addRow([`المشروع: ${reportData.projectName}`, "", "", "", `التاريخ: ${reportData.date}`, `المرجع: ${reportId}`]);
    infoRow.font = { bold: true, size: 11 };
    sheet.mergeCells(`A5:C5`);
    sheet.mergeCells(`E5:F5`);

    sheet.addRow([]); // Gap

    // --- Table Header ---
    const headerRow = sheet.addRow(["الموقع", "الكاشير", "السيارات", "المواقف", "الفاليه", "المجموع"]);
    headerRow.height = 30;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { 
        top: { style: 'thin', color: { argb: 'FF1E293B' } },
        bottom: { style: 'thin', color: { argb: 'FF1E293B' } }
      };
    });

    // --- Data Rows ---
    Object.entries(revenueData.revenueByHotel).forEach(([hotel, data]: [string, any]) => {
      const row = sheet.addRow([
        hotel,
        data.cashierName || '-',
        data.cars || 0,
        data.parking || 0,
        data.valet || 0,
        data.total || 0
      ]);
      row.height = 25;
      row.eachCell((cell) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } } };
      });
    });

    // --- Totals Row ---
    const totalRow = sheet.addRow([
      "الإجمالي الكلي TOTAL",
      "",
      Object.values(revenueData.revenueByHotel).reduce((a, b: any) => a + (b.cars || 0), 0),
      Object.values(revenueData.revenueByHotel).reduce((a, b: any) => a + (b.parking || 0), 0),
      Object.values(revenueData.revenueByHotel).reduce((a, b: any) => a + (b.valet || 0), 0),
      Object.values(revenueData.revenueByHotel).reduce((a, b: any) => a + (b.total || 0), 0)
    ]);
    totalRow.height = 30;
    totalRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    totalRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF059669' } }; // Emerald Total
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    sheet.addRow([]); sheet.addRow([]); // Gap

    // --- Footer: Signature ---
    const signatureLabelRow = sheet.addRow(["", "", "", "", "Approved By Management"]);
    signatureLabelRow.font = { size: 9, color: { argb: 'FF94A3B8' }, bold: true };

    const signatureNameRow = sheet.addRow(["", "", "", "", "Yousif Tariq"]);
    const signatureCell = signatureNameRow.getCell(5);
    signatureCell.font = { name: 'Brush Script MT', size: 22, color: { argb: 'FF4F46E5' } }; // Cursive in Excel
    signatureCell.alignment = { horizontal: 'center' };

    const titleRow = sheet.addRow(["", "", "", "", "Managing Director"]);
    titleRow.font = { size: 10, color: { argb: 'FF64748B' }, bold: true };
    titleRow.getCell(5).alignment = { horizontal: 'center' };

    const excelBuffer = await workbook.xlsx.writeBuffer();

    // 3. Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "easyvaletjo@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"Valet Professional Reports" <easyvaletjo@gmail.com>',
      to: "jodc.valet@gmail.com",
      subject: `📜 تقرير احترافي فائق الجودة: ${reportData.projectName} - ${reportData.date}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4f46e5;">تحية طيبة،</h2>
          <p>مرفق لكم التقرير الرسمي بجودة <b>Vector PDF</b> (نص قابل للتحديد) وملف <b>Excel</b> احترافي يتضمن شعار الشركة.</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0;">
            <b>المشروع:</b> ${reportData.projectName}<br/>
            <b>التاريخ:</b> ${reportData.date}<br/>
            <b>الرقم المرجعي:</b> ${reportId}
          </div>
          <br/>
          <p>تم التصميم والبرمجة بواسطة ❤️ <b>YOUSIF TARIQ</b></p>
        </div>
      `,
      attachments: [
        { filename: `Professional_Report_${reportId}.pdf`, content: pdfBuffer as any },
        { filename: `Analysis_Data_${reportId}.xlsx`, content: excelBuffer as any }
      ]
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Master Engine Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
