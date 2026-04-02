import { Coordinator } from './Coordinator';
import { Adversary } from './Adversary';
import { PersonaAgent } from '../services/PersonaAgent';
import { AppState } from './AppState';
import { ThinkingConfig } from './ThinkingConfig';
import { HistoryManager } from './HistoryManager';
import { PasteStore } from './PasteStore';
import { SkillRegistry } from './SkillRegistry';
import { CostTracker } from './CostTracker';
import { DirectivesService } from '../services/Directives';
import { KnowledgeService } from '../services/KnowledgeService';
import path from 'node:path';

export interface Pulse {
  agent: string;
  message: string;
  stats?: any;
}

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

  async submitMessage(userPrompt: string, onPulse?: (pulse: Pulse) => void): Promise<string> {
    const skill = this.skills.parse(userPrompt);
    if (skill) return await skill.execute(userPrompt);

    await this.appState.hydrate(this.dataDir);
    onPulse?.({ agent: 'Dojo Kernel', message: 'Master Neural Link Hydrated. Scanning archives...' });

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
    onPulse?.({ agent: 'Dojo Coordinator', message: 'Engaging Parallel Research Swarm (Fan-out)...' });
    const researchResult = await this.coordinator.optimizeResearch(userPrompt, fullScienceContext);
    
    // Emit pulses for each agent in the swarm
    for (const p of researchResult.pulses) {
      onPulse?.({ 
        agent: p.agent, 
        message: `Field Report: ${p.response.message.content.substring(0, 100)}...`,
        stats: p.response.stats
      });
    }

    this.appState.lastForensicReport = researchResult.content;

    // 2. Persona Synthesis 
    onPulse?.({ agent: 'Persona Agent', message: 'Bruce Lee is reflecting on the forensic truth...' });
    const masterResponse = await this.persona.synthesis(
      `${userPrompt}\n\n[INVIOLABLE LAWS]:\n${DirectivesService.LAWS}`, 
      researchResult.content, 
      fullScienceContext
    );
    onPulse?.({ agent: 'Persona Agent', message: 'Master Voice synthesized.', stats: masterResponse.stats });

    // 3. Adversarial Audit
    onPulse?.({ agent: 'Skeptical Master', message: 'Performing Adversarial Audit of Persona Fidelity...' });
    const adversaryResult = await this.adversary.verify(masterResponse.message.content, researchResult.content);
    onPulse?.({ agent: 'Skeptical Master', message: `Audit: ${adversaryResult.audit.passed ? 'PASSED' : 'RETRYING'} (Purity Score: ${adversaryResult.audit.score})`, stats: adversaryResult.response.stats });

    // 4. Adaptive Reflection (Healing)
    let finalMasterResponse = masterResponse.message.content;
    if (!adversaryResult.audit.passed) {
      onPulse?.({ agent: 'Dojo Kernel', message: 'Shadow Reflection: Repurifying the frequency...' });
      const retryResponse = await this.persona.synthesis(
        `RETRY: The Skeptical Master criticized your previous response.\nCRITIQUE: ${adversaryResult.audit.feedback}`, 
        researchResult.content, 
        fullScienceContext
      );
      finalMasterResponse = retryResponse.message.content;
      onPulse?.({ agent: 'Persona Agent', message: 'The Master is Ready.', stats: retryResponse.stats });
    }

    onPulse?.({ agent: 'Dojo Kernel', message: 'Finalizing Neural Link Transmission...' });

    // 5. Final Assembly for UI
    return `
<signals>
${researchResult.content}
</signals>

<soul>
${finalMasterResponse}
</soul>
`.trim();
  }
}
