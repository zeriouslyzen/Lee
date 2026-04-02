import fs from 'node:fs/promises';
import path from 'node:path';

const RTF_PATH = '/Users/jackdanger/Desktop/Bruce Lee - Bruce Lee copy.rtf';
const OUTPUT_PATH = path.join(process.cwd(), 'src/data/knowledge.json');

async function parseRTF() {
  console.log('--- Bruce Lee Archive Parser ---');
  try {
    const rawData = await fs.readFile(RTF_PATH, 'utf8');
    
    // Simple RTF-to-Text (stripping some common RTF tags)
    // For a complex RTF, we'd use a library, but for this forensic task, 
    // we'll extract the core text blocks.
    const text = rawData
      .replace(/\\rtf1[\s\S]*?\\f0\\fs24\\cf0 /g, '') // Basic header strip
      .replace(/\\par/g, '\n')
      .replace(/\\/g, '')
      .replace(/\{.*\}/g, '');

    const lines = text.split('\n').filter(l => l.trim().length > 0);
    
    // Chunk by Chapter or Topic
    const chunks = [];
    let currentTopic = 'General Philosophy';
    let currentContent: string[] = [];

    for (const line of lines) {
      if (line.match(/^\d+\s+\./) || line.toUpperCase().includes('CHAPTER') || line === line.toUpperCase()) {
        if (currentContent.length > 50) {
          chunks.push({
            topic: currentTopic,
            content: currentContent.join(' ').slice(0, 2000), // Cap for context
            tags: ['bruce_lee', 'archives', 'forensic']
          });
          currentContent = [];
        }
        currentTopic = line.trim();
      } else {
        currentContent.push(line.trim());
      }
    }

    // Final chunk
    if (currentContent.length > 0) {
      chunks.push({
        topic: currentTopic,
        content: currentContent.join(' '),
        tags: ['bruce_lee', 'archives', 'forensic']
      });
    }

    await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
    await fs.writeFile(OUTPUT_PATH, JSON.stringify(chunks, null, 2));

    console.log(`Successfully ingested ${chunks.length} knowledge nuggets into ${OUTPUT_PATH}`);
  } catch (error: any) {
    console.error('Parsing failed:', error.message);
  }
}

parseRTF();
