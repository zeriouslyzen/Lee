import { Hono } from 'hono';
import { BruceLeeAgent } from './agent/BruceLeeAgent.ts';
import { DreamTask } from './services/DreamTask.ts';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { cors } from 'hono/cors';
import fs from 'node:fs/promises';
import path from 'node:path';

const app = new Hono();
const agent = new BruceLeeAgent();
const DATA_DIR = path.join(process.cwd(), 'src/data');
const dreamTask = new DreamTask(DATA_DIR);

// Middleware
app.use('*', cors());
app.use('/public/*', serveStatic({ root: './' }));
app.get('/', serveStatic({ path: './public/index.html' }));

// Ensure data directory exists
await fs.mkdir(DATA_DIR, { recursive: true });

// V1 Chat (OpenAI Compatible)
app.post('/v1/chat', async (c) => {
  try {
    const { messages } = await c.req.json();
    const lastMessage = messages[messages.length - 1].content;
    const history = messages.slice(0, -1);
    
    const response = await agent.run(lastMessage, history);
    
    return c.json({
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: 'hermes3:8b',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: response,
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: -1,
        completion_tokens: -1,
        total_tokens: -1,
      },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Bruce Lee Specific: Consolidation (Dream)
app.post('/bruce/dream', async (c) => {
  try {
    await dreamTask.runConsolidation();
    return c.json({ success: true, message: 'Bruce Lee is dreaming. Memory consolidated.' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

serve({
  fetch: app.fetch,
  port: 3000,
});

export default {
  port: 3000,
  fetch: app.fetch,
};
