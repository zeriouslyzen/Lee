import fs from 'node:fs/promises';
import path from 'node:path';

export interface MemoryEntry {
  timestamp: string;
  category: 'philosophy' | 'training' | 'bio' | 'metaphysical';
  content: string;
  source?: string;
}

export class MemoryService {
  private memoryPath: string;

  constructor(dataDir: string) {
    this.memoryPath = path.join(dataDir, 'BRUCE.md');
  }

  async loadMemories(): Promise<string> {
    try {
      return await fs.readFile(this.memoryPath, 'utf8');
    } catch {
      return '# BRUCE.md - Persistent Forensic Memory\n\nNo memories captured yet.\n';
    }
  }

  async addMemory(entry: MemoryEntry) {
    const formatted = `\n### [${entry.timestamp}] ${entry.category.toUpperCase()}\n${entry.content}\n${entry.source ? `*Source: ${entry.source}*` : ''}\n---\n`;
    await fs.appendFile(this.memoryPath, formatted);
  }

  async consolidate(logs: any[]) {
    // Implement "Dream" consolidation logic: convert raw logs into high-level memory summaries
    const summary = `Consolidated analysis of ${logs.length} logs. Emerging pattern: Focus on "speed of the uncoiling spring".`;
    await this.addMemory({
      timestamp: new Date().toISOString(),
      category: 'training',
      content: summary,
      source: 'DreamTask'
    });
  }
}
