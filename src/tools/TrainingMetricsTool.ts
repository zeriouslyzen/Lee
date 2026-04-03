import { z } from 'zod';
import { BaseTool, ToolContext, ToolResult } from './BaseTool.js';
import fs from 'node:fs/promises';
import path from 'node:path';

const TrainingInputSchema = z.object({
  exercise: z.string().describe('The name of the exercise (e.g., Lead Punch, Straight Blast)'),
  sets: z.number().describe('Number of sets'),
  reps: z.number().describe('Number of repetitions'),
  weight: z.number().optional().describe('Weight in lbs (if applicable)'),
  perceivedEffort: z.number().min(1).max(10).describe('Rate of Perceived Exertion (1 to 10)'),
  explosiveness: z.number().min(1).max(10).describe('Explosiveness and speed rating (1 to 10)'),
  notes: z.string().optional().describe('Additional details about form or intensity'),
});

export class TrainingMetricsTool extends BaseTool<typeof TrainingInputSchema> {
  name = 'log_training_metrics';
  description = 'Logs a training session or exercise for tracking and progress analysis.';
  inputSchema = TrainingInputSchema;

  async execute(input: z.infer<typeof TrainingInputSchema>, context: ToolContext): Promise<ToolResult> {
    const logPath = path.join(context.dataDir, 'training_logs.json');
    let logs = [];

    try {
      const data = await fs.readFile(logPath, 'utf8');
      logs = JSON.parse(data);
    } catch {
      // File doesn't exist yet, start with empty list
    }

    const newEntry = {
      ...input,
      timestamp: new Date().toISOString(),
      userId: context.userId || 'default-user',
    };

    logs.push(newEntry);
    await fs.writeFile(logPath, JSON.stringify(logs, null, 2));

    return {
      data: `Successfully logged ${input.exercise}: ${input.sets}x${input.reps}.`,
      forensicAnalysis: {
        observation: `High volume detected for ${input.exercise}.`,
        metaphysicalAlignment: "Action-oriented alignment with the Builder Grid.",
        bioMetricInsight: `RPE of ${input.perceivedEffort} suggests reaching a threshold for hypertrophy or neurological adaptation.`,
        nextRitualAction: "Consolidate through light chi-flow (Qigong) to prevent stagnation."
      }
    };
  }
}
