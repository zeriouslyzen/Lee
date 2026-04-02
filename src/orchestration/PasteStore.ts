import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

/**
 * PasteStore: Hash-Based Referencing (Inspired by Claude Code)
 * Purpose: To avoid bloating the context with large files by sending a 'Hash Reference' instead.
 */
export class PasteStore {
  private storeDir: string;

  constructor(dataDir: string) {
    this.storeDir = path.join(dataDir, 'pastes');
  }

  /**
   * Store: Writes a large text block to disk and returns its SHA-1 hash.
   */
  public async store(content: string): Promise<string> {
    const hash = createHash('sha1').update(content).digest('hex');
    const filePath = path.join(this.storeDir, `${hash}.txt`);

    try {
      await fs.mkdir(this.storeDir, { recursive: true });
      await fs.writeFile(filePath, content, 'utf8');
    } catch (error) {
      console.error('PasteStore write error:', error);
    }
    return hash;
  }

  /**
   * Reference: Returns the formatted reference tag for the prompt.
   */
  public formatRef(hash: string, label: string): string {
    return `[PASTED CONTENT: ${label} #sha1-${hash.substring(0, 8)}]`;
  }

  /**
   * Retrieve: Returns the content for a given hash.
   */
  public async retrieve(hash: string): Promise<string | null> {
    const filePath = path.join(this.storeDir, `${hash}.txt`);
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch {
      return null;
    }
  }
}
