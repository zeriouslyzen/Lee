import fs from 'node:fs/promises';
import path from 'node:path';
import { OllamaService } from './OllamaService.ts';
import { MemoryService } from './MemoryService.ts';

export class DreamTask {
  private ollama: OllamaService;
  private memory: MemoryService;
  private dataDir: string;

  constructor(dataDir: string) {
    this.ollama = new OllamaService();
    this.memory = new MemoryService(dataDir);
    this.dataDir = dataDir;
  }

  async runConsolidation() {
    const logPath = path.join(this.dataDir, 'training_logs.json');
    let logs = [];

    try {
      const data = await fs.readFile(logPath, 'utf8');
      logs = JSON.parse(data);
    } catch {
      console.log('No logs found for consolidation.');
      return;
    }

    if (logs.length === 0) return;

    // Use Ollama to "dream" (summarize/extract insights) over the logs
    const logSummary = JSON.stringify(logs.slice(-20)); // Last 20 logs
    const prompt = `You are performing a "Dream Consolidation" as the Bruce Lee AI. 
    Analyze these training logs and extract 1-2 profound philosophical or physical insights into the user's progress.
    Speak with intense, forensic precision.
    
    Logs: ${logSummary}`;

    const response = await this.ollama.chat([{ role: 'user', content: prompt }], 'hermes3:8b');
    const insight = response.message.content;

    await this.memory.addMemory({
      timestamp: new Date().toISOString(),
      category: 'training',
      content: `Consolidated Insight: ${insight}`,
      source: 'DreamTask'
    });

    console.log('DreamTask consolidation complete.');
  }
}
