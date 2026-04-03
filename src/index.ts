import 'dotenv/config';
import { Hono } from 'hono';
import { DojoKernel } from './orchestration/DojoKernel.js';
import { DreamTask } from './services/DreamTask.js';
import { serve } from '@hono/node-server';
import { handle } from '@hono/node-server/vercel';
import { serveStatic } from '@hono/node-server/serve-static';
import { streamText } from 'hono/streaming';
import { cors } from 'hono/cors';
import fs from 'node:fs/promises';
import path from 'node:path';

const app = new Hono();
const DATA_DIR = path.resolve(process.cwd(), 'src/data');

// Lazy Initialization Helpers
let kernelInstance: DojoKernel | null = null;
function getKernel() {
  if (!kernelInstance) kernelInstance = new DojoKernel();
  return kernelInstance;
}

let dreamTaskInstance: DreamTask | null = null;
function getDreamTask() {
  if (!dreamTaskInstance) dreamTaskInstance = new DreamTask(DATA_DIR);
  return dreamTaskInstance;
}

// Vercel Serverless Exports
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

// Middleware
app.use('*', cors());
app.use('/public/*', serveStatic({ root: './' }));
app.get('/', serveStatic({ path: './public/index.html' }));

// V1 Chat (Now Streaming with Neural Pulse)
app.post('/v1/chat', async (c) => {
  try {
    const { messages, provider } = await c.req.json();
    const lastMessage = messages[messages.length - 1].content;
    const kernel = getKernel();
    
    return streamText(c, async (stream) => {
      // 1. Brain Rerouting (Neural Pulse)
      const response = await kernel.submitMessage(lastMessage, (pulse) => {
        stream.write(`PULSE:${JSON.stringify(pulse)}\n`);
      }, provider);

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
    const dreamTask = getDreamTask();
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
