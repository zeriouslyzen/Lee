import { BruceLeeAgent } from './agent/BruceLeeAgent.ts';

async function test() {
  const agent = new BruceLeeAgent();
  
  console.log('--- Testing Bruce Lee Agent ---');
  
  const testPrompts = [
    "How should I train my lead punch for maximum explosiveness?",
    "Log a training session: 10 sets of 50 reps for Lead Kick, RPE 8, explosiveness 9.",
    "I have some muscle soreness after my workout. Any TCM advice?",
    "Show me a graph of my explosiveness over the last 7 days."
  ];

  for (const prompt of testPrompts) {
    console.log(`\n> User: ${prompt}`);
    try {
      const response = await agent.run(prompt);
      console.log(`\n> Bruce Lee: ${response}`);
    } catch (err) {
      console.error(`\n! Error:`, err);
    }
  }
}

test();
