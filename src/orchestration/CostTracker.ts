import { AppState } from './AppState.js';

/**
 * CostTracker: The Chi Overseer (Point 7/6 Module)
 * Purpose: To monitor token expenditure and prevent 'Runaway AI' or logic loops.
 */
export class CostTracker {
  private static TOKEN_RATIO = 0.75; // Approx chars to tokens for local models
  private appState: AppState;
  public totalTokens: number = 0;
  private maxBudget: number = 20000; // Hard stop at 20k tokens per turn

  constructor() {
    this.appState = AppState.getInstance();
  }

  /**
   * Track: Estimates and records the "Chi" (Energy) of a research pass.
   */
  public track(content: string, source: string) {
    const estimatedTokens = Math.floor(content.length * CostTracker.TOKEN_RATIO);
    this.totalTokens += estimatedTokens;

    if (this.totalTokens > this.maxBudget) {
      throw new Error(`CRITICAL CHI DRAIN: Token budget exceeded in ${source}. Terminating loop.`);
    }

    console.log(`[CHI MONITOR: ${source}] Cumulative Tokens: ${this.totalTokens}`);
  }

  public getStatus() {
    return {
      tokens: this.totalTokens,
      health: this.totalTokens > (this.maxBudget * 0.8) ? 'CRITICAL' : 'STABLE'
    };
  }
}
