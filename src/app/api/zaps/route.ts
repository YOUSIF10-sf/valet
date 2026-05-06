import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { rows, hotelId } = await request.json();

    if (!rows || !Array.isArray(rows)) {
      return NextResponse.json({ success: false, message: "بيانات غير صالحة" }, { status: 400 });
    }

    for (const row of rows) {
      const parking = parseFloat(row.parking) || 0;
      const valet = parseFloat(row.valet) || 0;
      const totalAmount = parking + valet;

      // Note: We use the car_number field to store both hotel and plate for now if schema isn't updated
      // OR we can just save it. Let's assume we want to keep it simple.
      await db.execute({
        sql: "INSERT INTO zaps (amount, car_number, hotel_name, status) VALUES (?, ?, ?, ?)",
        args: [
          totalAmount,
          row.plate || "N/A",
          row.hotelId || "N/A",
          'completed'
        ],
      });
    }

    return NextResponse.json({ success: true, message: `تم حفظ ${rows.length} عمليات بنجاح` });
  } catch (error: any) {
    console.error("Save zaps error:", error);
    return NextResponse.json({ success: false, message: "حدث خطأ أثناء حفظ العمليات" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await db.execute("SELECT * FROM zaps ORDER BY created_at DESC");
    return NextResponse.json({ success: true, zaps: result.rows });
  } catch (error: any) {
    console.error("Fetch zaps error:", error);
    return NextResponse.json({ success: false, message: "حدث خطأ أثناء جلب العمليات" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "رقم العملية مطلوب" }, { status: 400 });
    }

    await db.execute({
      sql: "DELETE FROM zaps WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({ success: true, message: "تم حذف العملية بنجاح" });
  } catch (error: any) {
    console.error("Delete zap error:", error);
    return NextResponse.json({ success: false, message: "حدث خطأ أثناء حذف العملية" }, { status: 500 });
  }
}
