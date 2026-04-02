import { ForensicAnalyst } from '../services/ForensicAnalyst';
import { Tactician } from './Tactician';
import { Alchemist } from './Alchemist';
import { BrainResponse } from '../services/BrainService';

export interface ResearchInsight {
  topic: string;
  finding: string;
}

export interface ResearchResult {
  content: string;
  pulses: {
    agent: string;
    response: BrainResponse;
  }[];
}

/**
 * Coordinator: High-Level Orchestrator (Inspired by Claude Code)
 * Purpose: To manage 'Fan-out' research tasks in parallel and synthesize them for the Persona.
 */
export class Coordinator {
  private analyst: ForensicAnalyst;
  private tactician: Tactician;
  private alchemist: Alchemist;

  constructor() {
    this.analyst = new ForensicAnalyst();
    this.tactician = new Tactician();
    this.alchemist = new Alchemist();
  }

  /**
   * Fan-out: Perform multiple specialized research tasks in parallel.
   */
  async optimizeResearch(userPrompt: string, archiveContext: string): Promise<ResearchResult> {
    // 1. Specialized Parallel Researchers (Point 10/2 Optimization)
    const [biomechanics, tactics, alchemy] = await Promise.all([
      this.analyst.analyze(userPrompt, `[BIOMECHANICS FOCUS]\n${archiveContext}`),
      this.tactician.analyze(userPrompt, `[COMBAT TACTICS FOCUS]\n${archiveContext}`),
      this.alchemist.analyze(userPrompt, `[TCM & RECOVERY FOCUS]\n${archiveContext}`)
    ]);

    // 2. Synthesis (The "Senior Lead" Job)
    const synthesizedTruth = `
<biomech>
${biomechanics.message.content.trim()}
</biomech>

<tactical>
${tactics.message.content.trim()}
</tactical>

<alchemical>
${alchemy.message.content.trim()}
</alchemical>
`.trim();

    return {
      content: synthesizedTruth,
      pulses: [
        { agent: 'Forensic Analyst', response: biomechanics },
        { agent: 'JKD Tactician', response: tactics },
        { agent: 'TCM Alchemist', response: alchemy }
      ]
    };
  }
}
