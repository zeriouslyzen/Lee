import { OllamaService } from './OllamaService.ts';

export class ForensicAnalyst {
  private ollama: OllamaService;

  constructor() {
    this.ollama = new OllamaService();
  }

  async analyze(userPrompt: string, archiveContext: string): Promise<string> {
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

    const response = await this.ollama.chat(messages, 'hermes3:8b');
    return response.message.content;
  }
}
