import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { type, config, title } = await request.json();

    if (!type || !config) {
      return NextResponse.json({ success: false, message: "Missing data" }, { status: 400 });
    }

    const id = Math.random().toString(36).substring(2, 10); 

    await db.execute({
      sql: "INSERT INTO shared_reports (id, type, config, title) VALUES (?, ?, ?, ?)",
      args: [id, type, JSON.stringify(config), title || "تقرير مشترك"],
    });

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("Share creation error:", error);
    return NextResponse.json({ success: false, message: "Error creating share link" }, { status: 500 });
  }
}
