import fs from 'node:fs/promises';
import path from 'node:path';

export interface AuditRecord {
  timestamp: string;
  prompt: string;
  analystReport: string;
  soulResponse: string;
  finalResponse: string;
  audit: {
    passed: boolean;
    feedback: string;
    score: number;
  };
  metrics: {
    totalLatencyMs: number;
    tokens: number;
    provider: 'local' | 'deepseek';
    retryCount: number;
  };
}

export class AuditLogger {
  private logPath: string;

  constructor(dataDir: string) {
    this.logPath = path.join(dataDir, 'audits.json');
  }

  async log(record: AuditRecord): Promise<void> {
    try {
      let logs: AuditRecord[] = [];
      try {
        const data = await fs.readFile(this.logPath, 'utf8');
        logs = JSON.parse(data);
      } catch (err) {
        // File doesn't exist yet, start fresh
      }

      logs.push(record);

      // Keep only the last 100 audits to prevent file bloat
      if (logs.length > 100) {
        logs = logs.slice(-100);
      }

      await fs.writeFile(this.logPath, JSON.stringify(logs, null, 2), 'utf8');
      console.log(`[AuditLogger] Record saved: Score ${record.audit.score}`);
    } catch (error: any) {
      console.error(`[AuditLogger] Failed to save audit log: ${error.message}`);
    }
  }
}
