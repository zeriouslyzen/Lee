import { z } from 'zod';
import { BaseTool, ToolContext, ToolResult } from './BaseTool.ts';
import fs from 'node:fs/promises';
import path from 'node:path';

const GraphInputSchema = z.object({
  metricType: z.enum(['explosiveness', 'rpe', 'volume', 'recovery']).describe('The training metric to graph'),
  timeRange: z.enum(['7days', '30days', 'all']).describe('The time range for the chart'),
});

export class GraphVisualizerTool extends BaseTool<typeof GraphInputSchema> {
  name = 'generate_graph_data';
  description = 'Generates structured JSON data for visualizing training progress over time.';
  inputSchema = GraphInputSchema;

  async execute(input: z.infer<typeof GraphInputSchema>, context: ToolContext): Promise<ToolResult> {
    const logPath = path.join(context.dataDir, 'training_logs.json');
    let logs = [];

    try {
      const data = await fs.readFile(logPath, 'utf8');
      logs = JSON.parse(data);
    } catch {
      // File doesn't exist yet, return empty
      return { 
        data: JSON.stringify({ error: 'No training logs found for graphing.' }),
        forensicAnalysis: {
          observation: "No logs found.",
          metaphysicalAlignment: "Empty Grid.",
          bioMetricInsight: "No data to analyze.",
          nextRitualAction: "Initialize monitoring."
        }
      };
    }

    // Filter and aggregate data for graphing
    const graphData = logs.map((f: Record<string, any>) => ({
      date: f.timestamp,
      value: f[input.metricType] || 0,
      label: f.exercise,
    }));

    const result = {
      metric: input.metricType,
      timeRange: input.timeRange,
      series: graphData,
      status: 'ready_for_ui_render'
    };

    return {
      data: JSON.stringify(result, null, 2),
      forensicAnalysis: {
        observation: `Synthesizing ${input.metricType} trends over ${input.timeRange}.`,
        metaphysicalAlignment: "Builder Grid visualization.",
        bioMetricInsight: "Identifying patterns in the energy amplitude.",
        nextRitualAction: "Analyze the peaks for timeline coding potential."
      }
    };
  }
}
