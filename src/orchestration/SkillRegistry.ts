import { AppState } from './AppState.js';

/**
 * SkillRegistry: Command Pattern Infrastructure (Point 6 Module)
 * Purpose: To decouple complex multi-agent routines (e.g. /drill, /spar) from the main Kernel loop.
 */
export interface Skill {
  name: string;
  trigger: string; // The /command
  description: string;
  execute(userPrompt: string): Promise<string>;
}

export class SkillRegistry {
  private skills: Map<string, Skill> = new Map();

  constructor() {
    // 1. Initial core skills
    this.register({
      name: 'Training Drill',
      trigger: 'drill',
      description: 'Generate high-intensity training drills spanning isometric and explosive power.',
      execute: async (userPrompt: string) => {
        return `[SKILL: DRILL ACTIVATED]
The Master is deconstructing a specialized drill for you.
Focus on the John Little archives for Forearm Density and High-Intensity circuits.
Execute with 100% effort or do not execute at all.
---
${userPrompt.replace('/drill', '').trim()}`;
      }
    });
  }

  public register(skill: Skill) {
    this.skills.set(skill.trigger, skill);
  }

  public getSkill(trigger: string): Skill | undefined {
    return this.skills.get(trigger);
  }

  /**
   * Parse: Scans a user prompt for a /command and returns the skill.
   */
  public parse(userPrompt: string): Skill | undefined {
    const match = userPrompt.match(/^\/(\w+)/);
    if (match) {
      return this.getSkill(match[1]);
    }
    return undefined;
  }
}
