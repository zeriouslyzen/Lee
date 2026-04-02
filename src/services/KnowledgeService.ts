import fs from 'node:fs/promises';
import path from 'node:path';

export interface KnowledgeNugget {
  topic: string;
  content: string;
  tags: string[];
}

export class KnowledgeService {
  private dataPath: string;
  private cache: KnowledgeNugget[] | null = null;

  constructor(dataDir: string) {
    this.dataPath = path.join(dataDir, 'knowledge.json');
  }

  private async load() {
    if (this.cache) return this.cache;
    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      this.cache = JSON.parse(data);
    } catch {
      this.cache = [];
    }
    return this.cache;
  }

  async findRelevant(query: string, limit = 2): Promise<KnowledgeNugget[]> {
    const nuggets = await this.load();
    if (!nuggets) return [];

    const keywords = query.toLowerCase().split(/\s+/);
    
    // Simple relevance score: count keyword matches in topic/content
    const scored = nuggets.map(n => {
      let score = 0;
      keywords.forEach(kw => {
        if (n.topic.toLowerCase().includes(kw)) score += 5;
        if (n.content.toLowerCase().includes(kw)) score += 1;
      });
      return { ...n, score };
    });

    return scored
      .filter(n => n.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}
