import { AppState } from './AppState.js';

/**
 * HistoryManager: Session Scrubbing & Context Truncation (Inspired by Claude Code)
 * Purpose: To manage the 'Conversation Window' efficiently, preventing context bloat.
 */
export class HistoryManager {
  private static MAX_TURNS = 10;
  private appState: AppState;

  constructor() {
    this.appState = AppState.getInstance();
  }

  /**
   * Scrub: Removes 'Clinical Noise' (The raw forensic deconstruction) from older history items.
   * We keep the 'Soul' (Master Response) but truncate the 'Forensic Microscope' for turns > 3.
   */
  public scrub(history: any[]) {
    if (history.length <= 6) return; // 3 turns (User + Asst)

    this.appState.sessionHistory = history.map((msg, index) => {
      if (msg.role === 'assistant' && index < history.length - 4) {
        // Truncate forensic logs in older master responses
        return {
          ...msg,
          content: msg.content.replace(/<forensic>[\s\S]*?<\/forensic>/i, '<forensic>[ARCHIVED FOR TOKENS]</forensic>')
        };
      }
      return msg;
    });
  }

  /**
   * Prune: Hard-truncates history if it exceeds the turn limit.
   */
  public pruneHistory() {
    if (this.appState.sessionHistory.length > HistoryManager.MAX_TURNS * 2) {
      this.appState.sessionHistory = this.appState.sessionHistory.slice(-HistoryManager.MAX_TURNS * 2);
    }
  }
}
