/**
 * ThinkingConfig: Adaptive Chain-of-Thought (Inspired by Claude Code Thinking)
 * Purpose: To dynamically adjust the 'Thinking Depth' and 'Model Parameters' based on prompt complexity.
 */
export interface ThinkingParams {
  type: 'adaptive' | 'fast' | 'deep';
  maxTokens: number;
  model: string;
}

export class ThinkingConfig {
  /**
   * Adaptive Logic: Determines the depth of reflection required for the Master's response.
   */
  public static getParams(userPrompt: string): ThinkingParams {
    const intensity = userPrompt.length > 100 || userPrompt.toLowerCase().includes('help') || userPrompt.toLowerCase().includes('hurt');

    if (intensity) {
      return {
        type: 'deep',
        maxTokens: 8192, // Scaling Point 8: Multi-turn deconstruction
        model: 'hermes3:8b'
      };
    }

    return {
      type: 'fast',
      maxTokens: 2048, // Scaling Point 8: Single-turn dialogue
      model: 'hermes3:8b'
    };
  }
}
