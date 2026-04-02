import { BrainService } from '../services/BrainService.ts';

/**
 * Tactician: The JKD Combat Algorithm
 * Purpose: To translate forensic data into immediate combat strategy.
 */
export class Tactician {
  private brain: BrainService;

  constructor() {
    this.brain = new BrainService();
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

    const response = await this.brain.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], 'hermes3:8b');

    return response.message.content;
  }
}
