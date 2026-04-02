import { BrainService, BrainResponse } from './BrainService.js';

export class ForensicAnalyst {
  private brain: BrainService;

  constructor() {
    this.brain = new BrainService();
  }

  async analyze(userPrompt: string, archiveContext: string): Promise<BrainResponse> {
    const systemPrompt = `You are a HIGH-LEVEL FORENSIC ANALYST & SPORTS SCIENTIST for katanx.com.
    
    TASK: Deconstruct the user's input with clinical precision.
    
    METRICS TO ANALYZE:
    1. BIOMECHANICS: Kinetic chain efficiency, joint alignment, power leakage.
    2. CNS TENSION: Nervous system firing patterns, muscular tension, neuromuscular load.
    3. CHI (METAPHYSICAL): Energetic flow, meridian blockages, center-of-gravity alignment.
    4. ARCHIVAL CORRELATION: Match with Bruce Lee's training diaries (Archives provided).

    YOUR VOICE: 100% Clinical, objective, and data-driven. NO persona. NO fluff.
    
    ARCHIVES:
    ${archiveContext}
    `;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    return this.brain.chat(messages, 'hermes3:8b');
  }
}
