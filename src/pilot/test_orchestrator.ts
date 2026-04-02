import { DojoKernel } from '../orchestration/DojoKernel.js';

/**
 * SHADOW DOJO: KERNEL TESTING
 * Benchmarking the 'Dojo Kernel' (Sprint 1) with full orchestration, signaling, and caching.
 */
async function main() {
  const kernel = new DojoKernel();

  const userPrompt = "My lead punch is feeling stiff. How do I improve?";

  console.log("--- 🐉 STARTING DOJO KERNEL TEST (SPRINT 1) ---");
  console.log(`INPUT: ${userPrompt}\n`);

  console.time("⏰ Total Kernel Turn Time");
  const response = await kernel.submitMessage(userPrompt);
  console.timeEnd("⏰ Total Kernel Turn Time");

  console.log("\n--- 🐉 FULL STRUCTURED OUTPUT ---");
  console.log(response);

  console.log("\n--- 🐉 KERNEL TEST COMPLETE ---");
}

main().catch(console.error);
