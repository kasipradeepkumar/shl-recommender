// 'use server';

/**
 * @fileOverview Ranks SHL assessments based on user needs using AI.
 *
 * This file defines a Genkit flow that takes user needs as input and returns a ranked list of SHL assessments.
 * - rankAssessments - The main function to rank assessments.
 * - RankAssessmentsInput - The input type for the rankAssessments function.
 * - RankAssessmentsOutput - The output type for the rankAssessments function.
 */

'use server';

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {ShlAssessment} from '@/services/shl';

const RankAssessmentsInputSchema = z.object({
  assessments: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        type: z.string(),
        focus: z.array(z.string()),
        application: z.array(z.string()),
        key_skills_assessed: z.array(z.string()),
        estimated_duration: z.string(),
      })
    )
    .describe('A list of SHL assessments to rank.'),
  purpose: z.string().describe('The purpose of the assessment (e.g., Hiring, Development, Promotion).'),
  roleType: z.string().describe('The type of role being assessed (e.g., Managerial, Technical, Entry-Level).'),
  skills: z.array(z.string()).describe('A list of skills that are important for the role.'),
});

export type RankAssessmentsInput = z.infer<typeof RankAssessmentsInputSchema>;

const RankAssessmentsOutputSchema = z.array(
  z.object({
    assessment: z.object({
      name: z.string(),
      description: z.string(),
      type: z.string(),
      focus: z.array(z.string()),
      application: z.array(z.string()),
      key_skills_assessed: z.array(z.string()),
      estimated_duration: z.string(),
    }),
    score: z.number().describe('The AI-assigned relevance score for the assessment.'),
    reason: z.string().describe('Explanation of why the assessment received that score'),
  })
);

export type RankAssessmentsOutput = z.infer<typeof RankAssessmentsOutputSchema>;

export async function rankAssessments(input: RankAssessmentsInput): Promise<RankAssessmentsOutput> {
  return rankAssessmentsFlow(input);
}

const rankAssessmentsPrompt = ai.definePrompt({
  name: 'rankAssessmentsPrompt',
  input: {
    schema: z.object({
      assessments: z
        .array(
          z.object({
            name: z.string(),
            description: z.string(),
            type: z.string(),
            focus: z.array(z.string()),
            application: z.array(z.string()),
            key_skills_assessed: z.array(z.string()),
            estimated_duration: z.string(),
          })
        )
        .describe('A list of SHL assessments to rank.'),
      purpose: z.string().describe('The purpose of the assessment.'),
      roleType: z.string().describe('The type of role being assessed.'),
      skills: z.array(z.string()).describe('A list of skills that are important for the role.'),
    }),
  },
  output: {
    schema: z.array(
      z.object({
        assessment: z.object({
          name: z.string(),
          description: z.string(),
          type: z.string(),
          focus: z.array(z.string()),
          application: z.array(z.string()),
          key_skills_assessed: z.array(z.string()),
          estimated_duration: z.string(),
        }),
        score: z.number().describe('The AI-assigned relevance score for the assessment.'),
        reason: z.string().describe('Explanation of why the assessment received that score'),
      })
    ),
  },
  prompt: `You are an AI expert in evaluating talent assessment tests.

You will be provided with a list of assessments, along with the user's needs for the assessment.

Your job is to rank each assessment based on how well it aligns with the specified needs.

You must output a score (0-100) and a short explanation for each assessment.

User Needs:
Purpose: {{{purpose}}}
Role Type: {{{roleType}}}
Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Assessments:
{{#each assessments}}
Assessment Name: {{{this.name}}}
Description: {{{this.description}}}
Type: {{{this.type}}}
Focus: {{#each this.focus}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Application: {{#each this.application}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Key Skills Assessed: {{#each this.key_skills_assessed}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Estimated Duration: {{{this.estimated_duration}}}
---
{{/each}}`,
});

const rankAssessmentsFlow = ai.defineFlow<
  typeof RankAssessmentsInputSchema,
  typeof RankAssessmentsOutputSchema
>(
  {
    name: 'rankAssessmentsFlow',
    inputSchema: RankAssessmentsInputSchema,
    outputSchema: RankAssessmentsOutputSchema,
  },
  async input => {
    const {output} = await rankAssessmentsPrompt(input);
    return output!;
  }
);
