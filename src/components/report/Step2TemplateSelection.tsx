import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface Step2TemplateSelectionProps {
    selectedTemplate: string | null;
    onSelectTemplate: (id: string) => void;
}

export function Step2TemplateSelection({ selectedTemplate, onSelectTemplate }: Step2TemplateSelectionProps) {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold font-headline mb-2">Select a Template</h2>
            <p className="text-muted-foreground mb-6">Choose a pre-designed template for your report.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {PlaceHolderImages.map((template) => (
                    <Card 
                        key={template.id} 
                        onClick={() => onSelectTemplate(template.id)}
                        className={cn("cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 relative",
                            selectedTemplate === template.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                        )}
                    >
                        {selectedTemplate === template.id && (
                            <div className="absolute top-2 right-2 z-10 bg-primary rounded-full text-primary-foreground p-1">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        )}
                        <CardContent className="p-0">
                            <Image
                                src={template.imageUrl}
                                alt={template.description}
                                data-ai-hint={template.imageHint}
                                width={600}
                                height={400}
                                className="rounded-t-lg object-cover aspect-video"
                            />
                            <div className="p-4 text-left">
                                <h3 className="font-semibold font-headline">{template.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
