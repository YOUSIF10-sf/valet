import { ReportData } from '@/components/report/Step1DataInput';
import { RevenueData } from '@/components/report/Step2TemplateSelection';

export async function saveToGoogleSheets(reportData: ReportData, revenueData: RevenueData, reportId: string) {
    // URL given by Google Apps Script Web App Deployment
    const WEB_APP_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBAPP_URL;

    if (!WEB_APP_URL) {
        throw new Error("لم يتم إعداد رابط Google Sheets السري (Web App URL) في النظام.");
    }

    // Calculate totals for the payload
    const totalCars = Object.values(revenueData.revenueByHotel).reduce((acc, curr) => acc + (curr.cars || 0), 0);
    const totalParking = Object.values(revenueData.revenueByHotel).reduce((acc, curr) => acc + (curr.parking || 0), 0);
    const totalValet = Object.values(revenueData.revenueByHotel).reduce((acc, curr) => acc + (curr.valet || 0), 0);
    const tableTotal = totalParking + totalValet;

    // Explicit 0 defaults for NaN or undefined math results
    const cash = revenueData.totalCash || 0;
    const network = revenueData.totalNetwork || 0;
    const cashNetworkTotal = cash + network;
    const difference = tableTotal - cashNetworkTotal;

    // Formatting date
    const formattedDate = reportData.date
        ? new Date(reportData.date).toISOString().split('T')[0]
        : 'N/A';

    // Construct the payload rows (One row per hotel that has data)
    const rows: any[] = [];
    const reportTypeFormatted = reportData.reportType === 'monthly' ? 'شهري (Monthly)' : 'يومي (Daily)';
    const shiftFormatted = reportData.shift === 'evening' ? 'مسائية' : 'صباحية';

    Object.entries(revenueData.revenueByHotel).forEach(([hotelName, data]) => {
        // Only include hotels that actually have data
        if ((data.cars || 0) > 0 || (data.parking || 0) > 0 || (data.valet || 0) > 0) {
            const rowTotal = (data.parking || 0) + (data.valet || 0);

            rows.push({
                reportId: reportId || 'N/A',
                date: formattedDate,
                projectName: reportData.projectName || 'N/A',
                reportType: reportTypeFormatted,
                supervisor: reportData.supervisorName || 'N/A',
                shift: shiftFormatted,
                hotelName: hotelName,
                cashierName: data.cashierName || 'N/A',
                cars: data.cars || 0,
                parking: (data.parking || 0).toFixed(2),
                valet: (data.valet || 0).toFixed(2),
                rowTotal: rowTotal.toFixed(2),
                // Global Totals (Repeated for context if needed, or just kept for the first row)
                globalCash: cash.toFixed(2),
                globalNetwork: network.toFixed(2),
                globalGrandTotal: tableTotal.toFixed(2),
                globalDifference: difference.toFixed(2)
            });
        }
    });

    const payload = {
        type: 'report', // Flag for Unified Google Apps Script routing
        multipleRows: true, // Flag to tell Apps Script to loop
        rows: rows
    };

    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            // mode: 'no-cors' // Use no-cors to bypass CORS blocks on Google Apps Script APIs 
            // Important: With no-cors, you can't read the response body, but the write still succeeds on Google's end.
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        // Because of no-cors, fetch will always return an "opaque" standard response even if successful.
        // We will assume success if it didn't throw a network error.
        return true;

    } catch (error) {
        console.error("Error saving to Google Sheets:", error);
        throw new Error("حدث خطأ أثناء الاتصال بقاعدة بيانات جوجل.");
    }
}
