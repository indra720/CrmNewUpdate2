'use server';

/**
 * @fileOverview Smart file import flow that uses an LLM to parse and import data from various file formats,
 * even if the file structure is not perfectly aligned with the database schema.
 *
 * - smartFileImport - A function that handles the smart file import process.
 * - SmartFileImportInput - The input type for the smartFileImport function.
 * - SmartFileImportOutput - The return type for the smartFileImport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartFileImportInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  fileType: z.string().describe('The MIME type of the uploaded file.'),
  instructions: z
    .string()
    .optional()
    .describe(
      'Optional instructions for parsing the file, such as specifying column delimiters or data formats.'
    ),
  expectedSchema: z.string().describe('A description of the expected schema for the data.'),
});
export type SmartFileImportInput = z.infer<typeof SmartFileImportInputSchema>;

const SmartFileImportOutputSchema = z.object({
  parsedData: z
    .array(z.record(z.any()))
    .describe('The parsed data from the file, represented as an array of objects.'),
  schemaSummary: z
    .string()
    .optional()
    .describe('A summary of the inferred schema from the uploaded file.'),
  parsingNotes: z
    .string()
    .optional()
    .describe('Notes on any parsing issues or data transformations performed.'),
});
export type SmartFileImportOutput = z.infer<typeof SmartFileImportOutputSchema>;

export async function smartFileImport(input: SmartFileImportInput): Promise<SmartFileImportOutput> {
  return smartFileImportFlow(input);
}

const smartFileImportPrompt = ai.definePrompt({
  name: 'smartFileImportPrompt',
  input: {schema: SmartFileImportInputSchema},
  output: {schema: SmartFileImportOutputSchema},
  prompt: `You are an expert data parser, tasked with extracting data from uploaded files.

You will receive the file data as a data URI, the file type, and instructions on how to parse the file.

Your goal is to extract the data into a structured format, conforming to the expected schema as closely as possible.

File Type: {{{fileType}}}

File Data: {{media url=fileDataUri}}

Instructions: {{{instructions}}}

Expected Schema: {{{expectedSchema}}}

Output the data as a JSON array of objects.  If you can infer a schema from the file, summarize the schema and include it in the schemaSummary field.
Include any notes on parsing issues or data transformations performed in the parsingNotes field.

Ensure that the output is valid JSON.
`,
});

const smartFileImportFlow = ai.defineFlow(
  {
    name: 'smartFileImportFlow',
    inputSchema: SmartFileImportInputSchema,
    outputSchema: SmartFileImportOutputSchema,
  },
  async input => {
    const {output} = await smartFileImportPrompt(input);
    return output!;
  }
);
