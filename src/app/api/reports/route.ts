import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const result = await db.execute("SELECT * FROM reports ORDER BY date DESC");
    return NextResponse.json({ success: true, reports: result.rows });
  } catch (error: any) {
    console.error("Fetch reports error:", error);
    return NextResponse.json({ success: false, message: "حدث خطأ أثناء جلب التقارير" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { reportData, revenueData, reportId } = await request.json();

    // 1. Calculate total metrics
    const totalCars = Object.values(revenueData.revenueByHotel).reduce((acc: any, { cars }: any) => acc + (Number(cars) || 0), 0);
    const totalParking = Object.values(revenueData.revenueByHotel).reduce((acc: any, { parking }: any) => acc + (Number(parking) || 0), 0);
    const totalValet = Object.values(revenueData.revenueByHotel).reduce((acc: any, { valet }: any) => acc + (Number(valet) || 0), 0);
    const totalRevenue = totalParking + totalValet;

    // 2. Save main report record with breakdown JSON
    await db.execute({
      sql: "INSERT INTO reports (date, supervisor, total_revenue, cars_handled, parking_count, notes, detailed_data, valet_revenue) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      args: [
        reportData.date,
        "N/A", 
        totalRevenue,
        totalCars,
        totalParking,
        reportData.notes || "",
        JSON.stringify(revenueData),
        totalValet // New column
      ],
    });

    // 3. Save individual hotel revenues (optional but good for tracking)
    // We could create a hotel_revenues table if needed, but for now let's just save the main report.

    return NextResponse.json({ success: true, message: "تم حفظ التقرير بنجاح" });
  } catch (error: any) {
    console.error("Save report error details:", error);
    return NextResponse.json({ success: false, message: `حدث خطأ أثناء حفظ التقرير: ${error.message}` }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "معرف التقرير مطلوب" }, { status: 400 });
    }

    await db.execute({
      sql: "DELETE FROM reports WHERE id = ?",
      args: [id]
    });

    return NextResponse.json({ success: true, message: "تم حذف التقرير بنجاح" });
  } catch (error: any) {
    console.error("Delete report error:", error);
    return NextResponse.json({ success: false, message: "حدث خطأ أثناء حذف التقرير" }, { status: 500 });
  }
}
