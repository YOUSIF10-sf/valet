import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const result = await db.execute({
      sql: "SELECT * FROM shared_reports WHERE id = ?",
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: "Report not found" }, { status: 404 });
    }

    const report = result.rows[0];
    return NextResponse.json({ 
      success: true, 
      report: {
        ...report,
        config: JSON.parse(report.config as string)
      }
    });
  } catch (error: any) {
    console.error("Share fetch error:", error);
    return NextResponse.json({ success: false, message: "Error fetching shared report" }, { status: 500 });
  }
}
