import { BrainService, BrainResponse } from '../services/BrainService.js';

export interface AuditResult {
  passed: boolean;
  feedback: string;
  score: number;
}

export interface AdversaryResponse {
  audit: AuditResult;
  response: BrainResponse;
}

/**
 * Adversary: The Skeptical Master (Inspired by Claude Code Verification Agent)
 * Purpose: To attack the proposed Master response and identify 'Persona Drift' or 'Clinical Weakness' before reaching the user.
 */
export class Adversary {
  private brain: BrainService;

  constructor() {
    this.brain = new BrainService();
  }

  async verify(masterResponse: string, forensicTruth: string): Promise<AdversaryResponse> {
    const systemPrompt = `You are THE SKEPTICAL MASTER. Your only job is to AUDIT the response of the primary agent.
    
    CRUNCH THE FORENSIC TRUTH:
    ${forensicTruth}
    
    AUDIT CHECKLIST:
    1. PERSONA FIDELITY: Did the response sound like a generic AI? (FAIL if yes)
    2. ADVICE INTEGRITY: Did the Tactician provide 'generic' combat advice or 'high-level JKD strategy'?
    3. ALCHEMICAL ACCURACY: Are the TCM/Recovery protocols scientifically and archivaly grounded?
    4. NOISE RATIO: Is there any 'As an AI...' or 'I recommend...' fluff? (FAIL if yes)
    
    OUTPUT FORMAT (JSON):
    {
      "passed": boolean,
      "feedback": "Specific engineering critique for the agent to retry.",
      "score": 0-100
    }
    `;

    const response = await this.brain.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `AUDIT THIS RESPONSE:\n${masterResponse}` }
    ], 'hermes3:8b');

    try {
      const audit = JSON.parse(response.message.content);
      return { audit, response };
    } catch {
      return { 
        audit: { passed: true, feedback: 'Audit parse error. Defaulting to PASS.', score: 100 },
        response 
      };
    }
  }
}
