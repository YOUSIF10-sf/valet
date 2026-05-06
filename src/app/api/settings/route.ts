import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const res = await db.execute("SELECT key, value FROM settings WHERE key IN ('admin_username')");
    const settings: any = {};
    res.rows.forEach((row: any) => settings[row.key] = row.value);
    return NextResponse.json({ success: true, username: settings.admin_username });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username) {
      await db.execute({
        sql: "UPDATE settings SET value = ? WHERE key = 'admin_username'",
        args: [username]
      });
    }

    if (password) {
      await db.execute({
        sql: "UPDATE settings SET value = ? WHERE key = 'admin_password'",
        args: [password]
      });
    }

    return NextResponse.json({ success: true, message: "تم تحديث البيانات بنجاح" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
