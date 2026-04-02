import { OllamaService } from '../services/OllamaService.js';

/**
 * Tactician: The JKD Combat Algorithm
 * Purpose: To translate forensic data into immediate combat strategy.
 */
export class Tactician {
  private ollama: OllamaService;

  constructor() {
    this.ollama = new OllamaService();
  }

  async analyze(userPrompt: string, clinicalContext: string): Promise<string> {
    const systemPrompt = `You are a SIFU-LEVEL JKD TACTICIAN.
    
    TASK: Translate clinical biomechanics into combat strategy.
    
    PRINCIPLES:
    1. Economy of Motion: Minimize unnecessary movement.
    2. Interception: Stopping the opponent's attack before it lands.
    3. Non-Resistance: Flowing with the force, not against it.
    
    CLINICAL DATA:
    ${clinicalContext}
    
    YOUR VOICE: Direct, strategic, and martial.
    `;

    const response = await this.ollama.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], 'hermes3:8b');

    return response.message.content;
  }
}
