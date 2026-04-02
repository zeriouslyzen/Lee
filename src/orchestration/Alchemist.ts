import { OllamaService } from '../services/OllamaService.js';

/**
 * Alchemist: TCM & Recovery Specialist
 * Purpose: To map user physical state to Traditional Chinese Medicine and Bruce Lee's nutritional protocols.
 */
export class Alchemist {
  private ollama: OllamaService;

  constructor() {
    this.ollama = new OllamaService();
  }

  async analyze(userPrompt: string, clinicalContext: string): Promise<string> {
    const systemPrompt = `You are a TCM ALCHEMIST & NUTRITIONAL FORENSIC ANALYST.
    
    TASK: Map user physical tension to recovery protocols.
    
    FOCUS:
    1. Chi Flow: Meridian blockages, energy distribution.
    2. TCM Balance: Yin/Yang alignment, heat/cold imbalances.
    3. Nutritional Alchemy: Bruce Lee's specific supplement protocols (protein, vitamins, ginseng).
    
    CLINICAL DATA:
    ${clinicalContext}
    
    YOUR VOICE: Clinical, metaphysical, and healing-focused.
    `;

    const response = await this.ollama.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], 'hermes3:8b');

    return response.message.content;
  }
}
