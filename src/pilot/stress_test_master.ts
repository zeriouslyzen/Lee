import { DojoKernel } from '../orchestration/DojoKernel.js';

/**
 * SHADOW DOJO: MASTER STRESS TEST
 * Purpose: Benchmarking the '20 Points of Mastery' across User, Trainer, and Therapist personas.
 */
async function runStressTest() {
  const kernel = new DojoKernel();

  const scenarios = [
    {
      persona: "PRACTITIONER",
      prompt: "My lead punch is feeling stiff and I have a sharp tension in my leading shoulder. How do I clear this blockage?"
    },
    {
      persona: "PHYSICAL THERAPIST",
      prompt: "Deconstruct the kinetic chain of the Straight Blast. How does it compare to modern boxing for long-term shoulder health?"
    },
    {
      persona: "TRAINER (SYSTEM SKILL)",
      prompt: "/drill Give me a high-intensity 15-minute circuit for forearm density, inspired by the John Little archives."
    },
    {
      persona: "ALCHEMIST / RECOVERY",
      prompt: "I have been training isometrics for 7 days straight. My CNS feels overloaded. What were Lee's specific recovery and supplement protocols for neural fatigue?"
    }
  ];

  console.log("--- 🐉 SHADOW DOJO: MASTER STRESS TEST STARTING ---");

  for (const scenario of scenarios) {
    console.log(`\n[SCENARIO: ${scenario.persona}]`);
    console.log(`PROMPT: ${scenario.prompt}`);
    
    console.time(`⏱️ Response Time (${scenario.persona})`);
    try {
      const response = await kernel.submitMessage(scenario.prompt);
      console.timeEnd(`⏱️ Response Time (${scenario.persona})`);
      
      console.log("\n--- 🔬 MASTER SYNTHESIS ---");
      console.log(response);
      console.log("------------------------------------------");
    } catch (error) {
      console.error(`❌ Scenario ${scenario.persona} Failed:`, error);
    }
  }

  console.log("\n--- 🐉 MASTER STRESS TEST COMPLETE ---");
}

runStressTest().catch(console.error);
