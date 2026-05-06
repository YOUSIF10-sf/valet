import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 0. Ensure table and default credentials exist
    await db.execute(`CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT UNIQUE, value TEXT)`);
    await db.execute({
      sql: "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?), (?, ?)",
      args: ["admin_username", process.env.ADMIN_USERNAME || "admin", "admin_password", process.env.ADMIN_PASSWORD || "valet2026"]
    });

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
