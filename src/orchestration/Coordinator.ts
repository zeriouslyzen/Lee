import { ForensicAnalyst } from '../services/ForensicAnalyst.js';
import { Tactician } from './Tactician.js';
import { Alchemist } from './Alchemist.js';

export interface ResearchInsight {
  topic: string;
  finding: string;
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
  async optimizeResearch(userPrompt: string, archiveContext: string): Promise<string> {
    // 1. Specialized Parallel Researchers (Point 10/2 Optimization)
    const [biomechanics, tactics, alchemy] = await Promise.all([
      this.analyst.analyze(userPrompt, `[BIOMECHANICS FOCUS]\n${archiveContext}`),
      this.tactician.analyze(userPrompt, `[COMBAT TACTICS FOCUS]\n${archiveContext}`),
      this.alchemist.analyze(userPrompt, `[TCM & RECOVERY FOCUS]\n${archiveContext}`)
    ]);

    // 2. Synthesis (The "Senior Lead" Job)
    // We combine the multi-dimensional findings into a single 'Forensic Truth'
    const synthesizedTruth = `
<biomech>
${biomechanics.trim()}
</biomech>

<tactical>
${tactics.trim()}
</tactical>

<alchemical>
${alchemy.trim()}
</alchemical>
`.trim();

    return synthesizedTruth;
  }
}
