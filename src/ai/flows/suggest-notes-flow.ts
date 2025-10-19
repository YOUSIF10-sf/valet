'use server';
/**
 * @fileOverview Flow for generating smart suggestions for report notes.
 *
 * - suggestNotes - A function that suggests notes based on report data.
 */

import {ai} from '@/ai/genkit';
import {SuggestNotesInputSchema, SuggestNotesOutputSchema, type SuggestNotesInput, type SuggestNotesOutput} from '@/ai/schemas/suggest-notes-schemas';


export async function suggestNotes(input: SuggestNotesInput): Promise<SuggestNotesOutput> {
  return suggestNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNotesPrompt',
  input: {schema: SuggestNotesInputSchema},
  output: {schema: SuggestNotesOutputSchema},
  prompt: `أنت مساعد خبير في كتابة التقارير الإدارية باللغة العربية. مهمتك هي إنشاء ملاحظة موجزة ومهنية لتقرير خدمة صف السيارات بناءً على البيانات التالية.
يجب أن تكون الملاحظة واضحة ومختصرة وتعكس الحالة التشغيلية.

إذا كان هناك غيابات، اذكرها بشكل واضح. إذا لم يكن هناك غيابات، أشر إلى أن سير العمل كان طبيعياً.
ابدأ الملاحظة بذكر نوع التقرير (يومي أو شهري).

بيانات التقرير:
- نوع التقرير: {{{reportType}}}
- الفندق: {{{hotel}}}
- عدد الحضور: {{{attendanceCount}}}
- عدد الغيابات: {{{absenceCount}}}
- اسم المشرف: {{{supervisorName}}}

قم بصياغة ملاحظات مناسبة بناءً على هذه البيانات.`,
});

const suggestNotesFlow = ai.defineFlow(
  {
    name: 'suggestNotesFlow',
    inputSchema: SuggestNotesInputSchema,
    outputSchema: SuggestNotesOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
