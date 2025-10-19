"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, File, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockUserData = [
  { "first_name": "John", "last_name": "Doe", "email_address": "john.doe@email.com", "sale_amount": "150.00" },
  { "first_name": "Jane", "last_name": "Smith", "email_address": "jane.smith@email.com", "sale_amount": "200.50" },
  { "first_name": "Peter", "last_name": "Jones", "email_address": "peter.jones@email.com", "sale_amount": "75.25" },
];
const mockTemplateFields = ["FirstName", "LastName", "Email", "Amount"];
const mockUserFields = ["first_name", "last_name", "email_address", "sale_amount"];

export function Step3MappingPreview() {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    setIsPreviewing(true);
    setTimeout(() => {
      setIsPreviewing(false);
      setIsGenerated(true);
    }, 2000);
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold font-headline mb-2">Map Fields & Preview</h2>
      <p className="text-muted-foreground mb-6">Match your data columns to the template fields, then generate a preview.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-headline">Map Data Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start gap-2">
                <div className="w-1/2 text-left">
                    <h4 className="font-semibold mb-2 text-sm">Your Columns</h4>
                    <div className="space-y-2">
                        {mockUserFields.map(field => <div key={field} className="p-2 border rounded-md bg-muted/50 text-sm truncate font-mono">{field}</div>)}
                    </div>
                </div>
                <div className="flex-1 space-y-[44px] mt-10 rtl:rotate-180">
                    {mockUserFields.map((_, i) => <div key={i} className="flex items-center justify-center text-muted-foreground"><ArrowRight className="w-4 h-4"/></div>)}
                </div>
                <div className="w-1/2 text-left">
                    <h4 className="font-semibold mb-2 text-sm">Template Fields</h4>
                     <div className="space-y-2">
                        {mockTemplateFields.map(field => <div key={field} className="p-2 border rounded-md bg-muted/50 text-sm truncate font-mono">{field}</div>)}
                    </div>
                </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">This is a visual representation. In a real app, you would use dropdowns to map fields.</p>
          </CardContent>
        </Card>

        <div className="flex flex-col">
          {!isGenerated ? (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12">
              <File className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Preview will appear here</h3>
              <p className="mt-1 text-sm text-muted-foreground">Generate a preview to see your report.</p>
              <Button onClick={handleGenerate} disabled={isPreviewing} className="mt-4">
                {isPreviewing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPreviewing ? "Generating..." : "Generate Preview"}
              </Button>
            </div>
          ) : (
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-lg font-headline">Report Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="excel">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="excel">Excel Preview</TabsTrigger>
                    <TabsTrigger value="pdf">PDF Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="excel">
                    <ScrollArea className="h-72 w-full rounded-md border mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {mockTemplateFields.map(field => <TableHead key={field}>{field}</TableHead>)}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockUserData.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.first_name}</TableCell>
                              <TableCell>{row.last_name}</TableCell>
                              <TableCell>{row.email_address}</TableCell>
                              <TableCell className="text-right">{row.sale_amount}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="pdf">
                    <ScrollArea className="h-72 w-full rounded-md border mt-4 p-4 text-left">
                       <h2 className="text-xl font-bold mb-4 font-headline">Monthly Sales Report</h2>
                       <p className="text-sm text-muted-foreground mb-4">Date: {new Date().toLocaleDateString()}</p>
                       <p>This document summarizes the sales activity for the past month. Please find the detailed table below.</p>
                       <div className="my-4 border-b"></div>
                        <Table>
                            <TableHeader><TableRow><TableHead>Full Name</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {mockUserData.map((row, i) => <TableRow key={i}><TableCell>{row.first_name} {row.last_name}</TableCell><TableCell className="text-right">${row.sale_amount}</TableCell></TableRow>)}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
