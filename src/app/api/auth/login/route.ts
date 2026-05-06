import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 1. Fetch credentials from DB
    const settingsRes = await db.execute("SELECT key, value FROM settings WHERE key IN ('admin_username', 'admin_password')");
    const settings: any = {};
    settingsRes.rows.forEach((row: any) => {
      settings[row.key] = row.value;
    });

    if (username === settings.admin_username && password === settings.admin_password) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
