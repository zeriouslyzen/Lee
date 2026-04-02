import { MemoryService } from '../services/MemoryService.ts';
import { KnowledgeService, KnowledgeNugget } from '../services/KnowledgeService.ts';
import { ForensicAnalyst } from '../services/ForensicAnalyst.ts';
import { PersonaAgent } from '../services/PersonaAgent.ts';
import path from 'node:path';

export class BruceLeeAgent {
  private memory: MemoryService;
  private knowledge: KnowledgeService;
  private analyst: ForensicAnalyst;
  private persona: PersonaAgent;
  private dataDir: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'src/data');
    this.memory = new MemoryService(this.dataDir);
    this.knowledge = new KnowledgeService(this.dataDir);
    this.analyst = new ForensicAnalyst();
    this.persona = new PersonaAgent();
  }

  async run(userPrompt: string, history: any[] = []) {
    // 1. Context Retrieval
    const relevantArchives = await this.knowledge.findRelevant(userPrompt);
    const archiveContext = relevantArchives.map((n: KnowledgeNugget) => `[ARCHIVE: ${n.topic}]\n${n.content}`).join('\n\n');

    // 2. Sequential Agentic Flow
    // Agent A: Forensic Research (Archives/Biometrics/CNS)
    const forensicReport = await this.analyst.analyze(userPrompt, archiveContext);

    // Agent B: The Soul (High-Amplitude Synthesis)
    const personaResponse = await this.persona.synthesis(userPrompt, forensicReport, archiveContext);

    // 3. Persistent Memory Update (Demo Ready)
    await this.memory.addMemory({
      timestamp: new Date().toISOString(),
      category: 'forensic',
      content: `Master Analysis: ${forensicReport.trim()}`,
      source: 'Multi-Agent Flow'
    });

    // 4. Multi-Agent Output (Structured for the UI)
    return `<forensic>\n${forensicReport}\n</forensic>\n${personaResponse}`;
  }
}
