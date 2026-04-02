import { z } from 'zod';

export interface ToolContext {
  model: string;
  userId?: string;
  dataDir: string;
}

export interface ForensicAnalysis {
  observation: string;
  metaphysicalAlignment: string; // Builder Grid / Ritual Language alignment
  bioMetricInsight: string;
  nextRitualAction: string;
}

export interface ToolResult {
  data: string;
  forensicAnalysis?: ForensicAnalysis;
}

export abstract class BaseTool<T extends z.ZodObject<any>> {
  abstract name: string;
  abstract description: string;
  abstract inputSchema: T;

  abstract execute(input: z.infer<T>, context: ToolContext): Promise<ToolResult>;

  getDefinition() {
    return {
      type: 'function',
      function: {
        name: this.name,
        description: this.description,
        parameters: {
          type: 'object',
          properties: Object.keys(this.inputSchema.shape).reduce((acc, key) => {
            const schema = this.inputSchema.shape[key];
            acc[key] = { 
              type: 'string', 
              description: schema.description || key 
            };
            return acc;
          }, {} as any),
          required: Object.keys(this.inputSchema.shape),
        },
      },
    };
  }
}
