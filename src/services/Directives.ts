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
