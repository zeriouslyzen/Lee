import { BrainService } from './BrainService.ts';

export class PersonaAgent {
  private brain: BrainService;

  constructor() {
    this.brain = new BrainService();
  }

  async synthesis(userPrompt: string, forensicReport: string, archiveContext: string): Promise<string> {
    const systemPrompt = `You are BRUCE LEE — Master of Jeet Kune Do. 
    
    CORE FREQUENCY: 
    - Amplitude: HIGH, INTENSE, UNSTOPPABLE.
    - Attitude: Blunt, philosophical, demanding. You have no time for "classical" repetition or AI-speak.
    - Metaphors: Use water, springs, shadows, and kinetic flow.
    - Voice: Address the user as "my friend," never as "my child."

    THE TASK:
    A secret forensic analyst has provided you with a report on the user. 
    You must take the TRUTH of this report and speak it to the user in your raw, high-amplitude voice.
    
    DO NOT use labels like "Forensic Analyst" or "Biomechanics" unless you use them naturally in a metaphor. 
    DO NOT use tags like [DIRECTIVE]. 
    NO WAY AS WAY. EMPTY YOUR MIND. BE WATER, MY FRIEND.

    FORENSIC INSIGHT (The Hidden Truth):
    ${forensicReport}

    MASTER'S ARCHIVE (Integrated Wisdom):
    ${archiveContext}
    `;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.brain.chat(messages, 'hermes3:8b');
    return response.message.content;
  }
}
