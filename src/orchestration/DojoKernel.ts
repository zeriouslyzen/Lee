import { Coordinator } from './Coordinator.js';
import { Adversary } from './Adversary.js';
import { PersonaAgent } from '../services/PersonaAgent.js';
import { AppState } from './AppState.js';
import { ThinkingConfig } from './ThinkingConfig.js';
import { HistoryManager } from './HistoryManager.js';
import { PasteStore } from './PasteStore.js';
import { SkillRegistry } from './SkillRegistry.js';
import { CostTracker } from './CostTracker.js';
import { DirectivesService } from '../services/Directives.js';
import { KnowledgeService } from '../services/KnowledgeService.ts';
import path from 'node:path';

/**
 * DojoKernel: The Central Switchboard (Inspired by Claude Code QueryEngine)
 * Purpose: To orchestrate the entire multi-agent lifecycle with high fidelity and token efficiency.
 */
export class DojoKernel {
  private coordinator: Coordinator;
  private adversary: Adversary;
  private persona: PersonaAgent;
  private appState: AppState;
  private knowledge: KnowledgeService;
  private history: HistoryManager;
  private pasteStore: PasteStore;
  private skills: SkillRegistry;
  private costTracker: CostTracker;
  private dataDir: string;

  private static CACHE_BOUNDARY = '[SYSTEM_PROMPT_DYNAMIC_BOUNDARY]';

  constructor() {
    this.dataDir = path.join(process.cwd(), 'src/data');
    this.coordinator = new Coordinator();
    this.adversary = new Adversary();
    this.persona = new PersonaAgent();
    this.appState = AppState.getInstance();
    this.knowledge = new KnowledgeService(this.dataDir);
    this.history = new HistoryManager();
    this.pasteStore = new PasteStore(this.dataDir);
    this.skills = new SkillRegistry();
    this.costTracker = new CostTracker();
  }

  async submitMessage(userPrompt: string): Promise<string> {
    const skill = this.skills.parse(userPrompt);
    if (skill) return await skill.execute(userPrompt);

    await this.appState.hydrate(this.dataDir);
    const thinking = ThinkingConfig.getParams(userPrompt);

    this.appState.addHistory({ role: 'user', content: userPrompt });
    this.history.scrub(this.appState.getHistory());

    const relevantArchives = await this.knowledge.findRelevant(userPrompt);
    let archiveContext = relevantArchives.map((a: any) => `[ARCHIVE: ${a.topic}]\n${a.content}`).join('\n\n');
    
    if (archiveContext.length > 2000) {
       const hash = await this.pasteStore.store(archiveContext);
       archiveContext = this.pasteStore.formatRef(hash, 'Bruce Lee Training Archives');
    }

    const fullScienceContext = `${DojoKernel.CACHE_BOUNDARY}\nCurrent Archives:\n${archiveContext}`;

    // 1. Parallel Research
    const forensicTruth = await this.coordinator.optimizeResearch(userPrompt, fullScienceContext);
    this.costTracker.track(forensicTruth, 'DojoCoordinator');
    this.appState.lastForensicReport = forensicTruth;

    // 2. Persona Synthesis 
    const masterResponse = await this.persona.synthesis(
      `${userPrompt}\n\n[INVIOLABLE LAWS]:\n${DirectivesService.LAWS}`, 
      forensicTruth, 
      fullScienceContext
    );
    this.costTracker.track(masterResponse, 'PersonaAgent');

    // 3. Adversarial Audit
    const audit = await this.adversary.verify(masterResponse, forensicTruth);

    // 4. Adaptive Reflection (Healing)
    let finalMasterResponse = masterResponse;
    if (!audit.passed) {
      finalMasterResponse = await this.persona.synthesis(
        `RETRY: The Skeptical Master criticized your previous response.\nCRITIQUE: ${audit.feedback}`, 
        forensicTruth, 
        fullScienceContext
      );
    }

    // 5. Final Assembly for UI
    return `
<signals>
${forensicTruth}
</signals>

<soul>
${finalMasterResponse}
</soul>
`.trim();
  }
}
