import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

export function Step1DataInput() {
  return (
    <div className="flex flex-col items-center text-center h-full justify-center">
      <h2 className="text-2xl font-bold font-headline mb-2">Provide Your Data</h2>
      <p className="text-muted-foreground mb-6 max-w-lg">
        You can either upload a CSV file or paste your data directly. The first row should contain your column headers.
      </p>
      <Tabs defaultValue="upload" className="w-full max-w-xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload CSV</TabsTrigger>
          <TabsTrigger value="manual">Paste Data</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <div className="mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center">
            <UploadCloud className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Click to upload a file</h3>
            <p className="mt-1 text-sm text-muted-foreground">CSV, TSV up to 10MB</p>
            <Input id="csv-upload" type="file" className="sr-only" accept=".csv,.tsv" />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <Button asChild className="mt-4 pointer-events-none">
                <span>Browse File</span>
              </Button>
            </label>
          </div>
        </TabsContent>
        <TabsContent value="manual">
            <Textarea 
                placeholder="Paste your data here. e.g.&#10;Name,Email,Amount&#10;John Doe,john@example.com,100&#10;Jane Smith,jane@example.com,150"
                className="mt-4 min-h-[250px] text-sm font-mono text-left"
            />
        </TabsContent>
      </Tabs>
    </div>
  );
}
