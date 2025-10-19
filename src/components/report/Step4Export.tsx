import { Button } from "@/components/ui/button";
import { Download, Repeat } from "lucide-react";
import { CheckCircle2 } from "lucide-react";

interface Step4ExportProps {
    onReset: () => void;
}

export function Step4Export({ onReset }: Step4ExportProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold font-headline mb-2">Your Report is Ready!</h2>
            <p className="text-muted-foreground mb-8">Download your generated report in your desired format.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="w-full sm:w-auto">
                    <Download className="mr-2 h-5 w-5" />
                    Download Excel (.xlsx)
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <Download className="mr-2 h-5 w-5" />
                    Download PDF (.pdf)
                </Button>
            </div>
            <Button variant="ghost" onClick={onReset}>
                <Repeat className="mr-2 h-4 w-4" />
                Create Another Report
            </Button>
        </div>
    );
}
