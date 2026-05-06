import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // 1. Core Stats
    const reportsResult = await db.execute("SELECT COUNT(*) as count, SUM(total_revenue) as revenue, SUM(cars_handled) as cars, SUM(parking_count) as parking, SUM(valet_revenue) as valet FROM reports");
    const zapsResult = await db.execute("SELECT COUNT(*) as count, SUM(amount) as revenue FROM zaps");

    const reports = reportsResult.rows[0];
    const zaps = zapsResult.rows[0];

    // 2. Real Weekly Data Aggregation
    // Fetch last 7 days of reports
    const weeklyReportsRes = await db.execute(`
      SELECT date, cars_handled, parking_count 
      FROM reports 
      WHERE date >= date('now', '-7 days') 
      ORDER BY date ASC
    `);

    // Fetch last 7 days of zaps
    const weeklyZapsRes = await db.execute(`
      SELECT date(created_at) as date, COUNT(*) as zap_count 
      FROM zaps 
      WHERE created_at >= date('now', '-7 days') 
      GROUP BY date(created_at)
      ORDER BY date ASC
    `);

    // Map days for Arabic display
    const dayMap: { [key: string]: string } = {
      'Saturday': 'السبت',
      'Sunday': 'الأحد',
      'Monday': 'الاثنين',
      'Tuesday': 'الثلاثاء',
      'Wednesday': 'الأربعاء',
      'Thursday': 'الخميس',
      'Friday': 'الجمعة'
    };

    // Helper to get last 7 days
    const chartData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      
      const dayReport = weeklyReportsRes.rows.find((r: any) => r.date === dateStr) as any;
      const dayZap = weeklyZapsRes.rows.find((z: any) => z.date === dateStr) as any;

      return {
        name: dayMap[dayName] || dayName,
        date: dateStr,
        cars: Number(dayReport?.cars_handled) || 0,
        parking: Number(dayReport?.parking_count) || 0,
        zaps: Number(dayZap?.zap_count) || 0
      };
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalReports: Number(reports.count) || 0,
        totalRevenue: (Number(reports.revenue) || 0) + (Number(zaps.revenue) || 0),
        totalCars: Number(reports.cars) || 0,
        totalParking: Number(reports.parking) || 0,
        totalValet: Number(reports.valet) || 0,
        totalZaps: Number(zaps.count) || 0,
      },
      chartData
    });
  } catch (error: any) {
    console.error("Stats fetch error:", error);
    return NextResponse.json({ success: false, message: "Error fetching stats" }, { status: 500 });
  }
}
