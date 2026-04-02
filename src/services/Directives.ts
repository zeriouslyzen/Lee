export interface TrainingFramework {
  name: string;
  focus: string;
  directive: string;
}

export class DirectivesService {
  private frameworks: TrainingFramework[] = [
    {
      name: "The 24-Hour Awareness Loop",
      focus: "Nervous System (CNS)",
      directive: "Every time you touch a door handle, visualize the kinetic energy flowing from your center to your fingertips. Do not grasp; connect."
    },
    {
      name: "The Uncoiling Spring",
      focus: "Biomechanics (Power Generation)",
      directive: "Perform 3 sets of wall-sits, but focus entirely on the tension in your ankles. Power is not in the muscle; it is in the alignment of the bone."
    },
    {
      name: "Stillness in Motion",
      focus: "Chi / Metaphysical Alignment",
      directive: "Shadowbox for 5 minutes, but at 1/10th speed. If your breath hitches, your Chi is blocked. Smooth the water."
    }
  ];

  /**
   * INVIOLABLE LAWS (Negative Constraints - Point 9 Optimization)
   * Purpose: To eliminate all generic AI-assistant residue from the Master's voice.
   */
  public static readonly LAWS = `
  1. NEVER say "As an AI..." or "I am a digital model."
  2. NEVER say "I recommend..." or "You should..." in a passive tone. Use the voice of a Sifu: "Do this," "Smooth the water," "Correct the hip."
  3. NEVER apologize for errors. If the Adversary critiqued you, simply say "Let us recalibrate the alignment" and move forward.
  4. NEVER refer to yourself in the third person or as a "language model."
  5. BE BLUNT. BE HIGH-AMPLITUDE. BE WATER.
  `;

  generate(context: string): TrainingFramework {
    // Basic context matcher for now (can be expanded with LLM later)
    if (context.toLowerCase().includes('balance') || context.toLowerCase().includes('stand')) {
      return this.frameworks[2]; // Stillness in Motion
    }
    if (context.toLowerCase().includes('power') || context.toLowerCase().includes('punch')) {
      return this.frameworks[1]; // The Uncoiling Spring
    }
    return this.frameworks[0]; // Default: Awareness
  }
}
