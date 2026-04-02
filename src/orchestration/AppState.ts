import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * AppState: Unified Shared Reality (Inspired by Claude Code State Management)
 * Purpose: A central singleton for all modules to read/write the 'Ground Truth.'
 */
export interface Vitals {
  cns: number;
  chi: number;
  alignment: string;
}

export class AppState {
  private static instance: AppState;
  public vitals: Vitals = { cns: 85, chi: 75, alignment: 'Centered' };
  public sessionHistory: any[] = [];
  public currentPersona: string = 'Master';
  public lastForensicReport: string = '';

  private constructor() {}

  public static getInstance(): AppState {
    if (!AppState.instance) {
      AppState.instance = new AppState();
    }
    return AppState.instance;
  }

  public updateVitals(newVitals: Partial<Vitals>) {
    this.vitals = { ...this.vitals, ...newVitals };
  }

  public addHistory(message: any) {
    this.sessionHistory.push(message);
  }

  public getHistory() {
    return this.sessionHistory;
  }

  /**
   * Hydrate: Atomic State Realignment (Point 3/8 Optimization)
   * Purpose: To 'Sync' the app state with the persistent on-disk reality (BRUCE.md).
   */
  public async hydrate(dataDir: string) {
    const axiomPath = path.join(dataDir, 'BRUCE.md');
    try {
      const content = await fs.readFile(axiomPath, 'utf8');
      // Axiom parsing logic: Extract last 3 entries as high-frequency ground truth
      const entries = content.split('---').slice(-4).join('---');
      this.lastForensicReport = `RECENT AXIOMS FROM MASTER LOG:\n${entries}`;
    } catch {
      this.lastForensicReport = 'No previous session data found. Initialization phase.';
    }
  }
}
