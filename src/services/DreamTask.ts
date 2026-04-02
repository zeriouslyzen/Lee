import fs from 'node:fs/promises';
import path from 'node:path';
import { BrainService } from './BrainService.ts';
import { MemoryService } from './MemoryService.ts';

export class DreamTask {
  private brain: BrainService;
  private memory: MemoryService;
  private dataDir: string;

  constructor(dataDir: string) {
    this.brain = new BrainService();
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

    // Use Ollama to "dream" (extract axioms) over the logs
    const logSummary = JSON.stringify(logs.slice(-30)); // Last 30 logs for deeper context
    const prompt = `
[DREAM CONSOLIDATION: AXIOM EXTRACTION]
Identify Permanent Physical/Mental Patterns (Axioms) from these logs.
Filter out the "fluff." Extract only the distilled forensic truths that must survive.

Logs: ${logSummary}

OUTPUT FORMAT:
### [YYYY-MM-DD] AXIOM
Forensic Insight: {The distilled truth about the user's body/mind}
Alignment: {The JKD/TCM principle involved}
`;

    const response = await this.brain.chat([{ role: 'user', content: prompt }], 'hermes3:8b');
    const insight = response.message.content;

    // Append to BRUCE.md for the Kernel to hydrate in the next session
    const axiomPath = path.join(this.dataDir, 'BRUCE.md');
    await fs.appendFile(axiomPath, `\n---\n${insight.trim()}\n`, 'utf8');

    console.log('DreamTask Axiom Compression complete.');
  }
}
