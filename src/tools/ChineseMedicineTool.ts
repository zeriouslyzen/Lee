import { z } from 'zod';
import { BaseTool, ToolContext, ToolResult } from './BaseTool.js';

const TCMInputSchema = z.object({
  symptom: z.string().describe('The physical or energetic symptom (e.g., muscle soreness, low energy, joint pain)'),
  intensity: z.number().min(1).max(5).describe('Intensity of the symptom (1-5)'),
  phase: z.enum(['post-workout', 'pre-workout', 'morning', 'evening']).describe('Which training phase the user is in'),
});

export class ChineseMedicineTool extends BaseTool<typeof TCMInputSchema> {
  name = 'chinese_medicine_advice';
  description = 'Provides holistic and herbal recovery advice based on Traditional Chinese Medicine (TCM) and Bruce Lees holistic practices.';
  inputSchema = TCMInputSchema;

  async execute(input: z.infer<typeof TCMInputSchema>, context: ToolContext): Promise<ToolResult> {
    const adviceMap: Record<string, string> = {
      'muscle soreness': 'Focus on herbal compresses (e.g., Dit Da Jow) and light Chi Kung (Qigong) to stimulate blood flow.',
      'low energy': 'Assess Chi blockage. Use adaptogenic herbs (Ginseng, Astragalus) and focus on diaphragmatic breathing.',
      'joint pain': 'Balance Yin/Yang. Warm the area, avoid cold drinks, and check for structural alignment in your lead footwork.',
    };

    const advice = adviceMap[input.symptom.toLowerCase()] || 
                  'Maintain internal balance. Drink warm herbal infusions and practice meditative movement for recovery.';

    return {
      data: `TCM Recovery Advice for ${input.symptom}: ${advice}`,
      forensicAnalysis: {
        observation: `User reports ${input.symptom} at intensity ${input.intensity}.`,
        metaphysicalAlignment: "Yin/Yang balancing phase.",
        bioMetricInsight: "Stagnation in local meridians affecting kinetic flow.",
        nextRitualAction: "Internal alchemy protocol: Warmth + Diaphragmatic breathing."
      }
    };
  }
}
