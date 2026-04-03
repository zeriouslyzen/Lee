import { z } from 'zod';
import { BaseTool, ToolContext, ToolResult } from './BaseTool.js';

const SportsSciInputSchema = z.object({
  topic: z.string().describe('The biomechanical or physiological concept to analyze (e.g., leverage, kinetic linking)'),
  technique: z.string().describe('The specific martial arts maneuver (e.g., straight punch, lead kick)'),
});

export class SportsScienceTool extends BaseTool<typeof SportsSciInputSchema> {
  name = 'sports_science_lookup';
  description = 'Provides biomechanical and physiological analysis for martial arts techniques based on Bruce Lees training philosophy and modern sports science.';
  inputSchema = SportsSciInputSchema;

  async execute(input: z.infer<typeof SportsSciInputSchema>, context: ToolContext): Promise<ToolResult> {
    const biomechanicsMap: Record<string, string> = {
      'straight punch': 'Focus on kinetic linking from the lead foot to the fist. The power comes from rotation and maintaining a "tight" structure upon impact. Avoid "telegraphing" by keeping the leading hand loose.',
      'lead kick': 'The lead kick is for speed and disruption. Pivot on the rear foot, and snap the lead shin into the target using a whip-like motion, returning instantly to a balanced stance.',
      'leverage': 'Leverage is about internal structure. Keep your center of gravity low and utilize the opponent\'s force against them by entering at an angle (the "closed doors" concept).',
    };

    const technique = (input.technique || input.topic || '').toLowerCase();
    const analysis = biomechanicsMap[technique] || 
                    'Analyze the motion for maximum efficiency. Reduce unnecessary muscle tension and focus on the "speed of the uncoiling spring".';

    return {
      data: `Analysis for ${input.technique}: ${analysis}`,
      forensicAnalysis: {
        observation: `Bio-mechanical focus on ${input.topic}.`,
        metaphysicalAlignment: "Kinetic Structuring in the 3D plane.",
        bioMetricInsight: "Neuro-muscular efficiency is prioritized over raw strength.",
        nextRitualAction: "Practice 'non-telegraphic' movement in front of a mirror."
      }
    };
  }
}
