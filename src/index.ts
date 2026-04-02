import 'dotenv/config';
import { Hono } from 'hono';
import { DojoKernel } from './orchestration/DojoKernel.ts';
import { DreamTask } from './services/DreamTask.ts';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { streamText } from 'hono/streaming';
import { cors } from 'hono/cors';
import fs from 'node:fs/promises';
import path from 'node:path';

const app = new Hono();
const kernel = new DojoKernel();
const DATA_DIR = path.join(process.cwd(), 'src/data');
const dreamTask = new DreamTask(DATA_DIR);

// Middleware
app.use('*', cors());
app.use('/public/*', serveStatic({ root: './' }));
app.get('/', serveStatic({ path: './public/index.html' }));

// V1 Chat (Now Streaming with Neural Pulse)
app.post('/v1/chat', async (c) => {
  try {
    const { messages, provider } = await c.req.json();
    const lastMessage = messages[messages.length - 1].content;
    
    return streamText(c, async (stream) => {
      // 1. Brain Rerouting (Neural Pulse)
      const response = await kernel.submitMessage(lastMessage, (pulse) => {
        stream.write(`PULSE:${JSON.stringify(pulse)}\n`);
      });

      // 2. Final Synthesis (The Soul)
      stream.write(`FINAL:${response}\n`);
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

if (process.env.NODE_ENV !== 'production') {
  serve({
    fetch: app.fetch,
    port: 3000,
  });
  console.log('--- 🐉 MASTER HALL LIVE ON LOCALHOST:3000 ---');
}

export default app;
