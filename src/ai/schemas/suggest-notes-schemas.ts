import {z} from 'genkit';

export const SuggestNotesInputSchema = z.object({
  reportType: z.string().describe('The type of the report (daily or monthly).'),
  attendanceCount: z.coerce.number().describe('The number of employees present.'),
  absenceCount: z.coerce.number().describe('The number of employees absent.'),
  supervisorName: z.string().describe('The name of the supervisor.'),
  hotel: z.string().describe('The name of the hotel.'),
});
export type SuggestNotesInput = z.infer<typeof SuggestNotesInputSchema>;

export const SuggestNotesOutputSchema = z.object({
  notes: z.string().describe('The suggested notes for the report.'),
});
export type SuggestNotesOutput = z.infer<typeof SuggestNotesOutputSchema>;
