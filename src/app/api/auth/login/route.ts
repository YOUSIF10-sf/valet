import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 1. Fetch credentials from DB
    console.log("Attempting login for user:", username);
    const settingsRes = await db.execute("SELECT key, value FROM settings WHERE key IN ('admin_username', 'admin_password')");
    
    const settings: any = {};
    settingsRes.rows.forEach((row: any) => {
      const key = row.key;
      const value = row.value;
      settings[key] = value;
    });

    console.log("DB Settings found:", Object.keys(settings));

    if (username === settings.admin_username && password === settings.admin_password) {
      console.log("Login successful!");
      return NextResponse.json({ success: true });
    } else {
      console.log("Login failed: Invalid credentials");
      return NextResponse.json({ success: false, message: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }
  } catch (error: any) {
    console.error("Login API Error:", error.message);
    return NextResponse.json({ success: false, message: `خطأ في الخادم: ${error.message}` }, { status: 500 });
  }
}
