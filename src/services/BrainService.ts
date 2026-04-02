import { Ollama } from 'ollama';

export interface BrainResponse {
  message: {
    content: string;
  };
  stats: {
    latencyMs: number;
    tokens: number;
    provider: 'local' | 'deepseek';
  };
}

export class BrainService {
  private ollama: Ollama;
  private deepseekKey: string | undefined;
  private defaultProvider: 'local' | 'deepseek';

  constructor() {
    this.defaultProvider = (process.env.LLM_PROVIDER as 'local' | 'deepseek') || 'local';
    this.deepseekKey = process.env.DEEPSEEK_API_KEY;
    
    const host = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
    this.ollama = new Ollama({ host });
  }

  async chat(messages: any[], model: string = 'hermes3:8b', provider?: 'local' | 'deepseek'): Promise<BrainResponse> {
    const selectedProvider = provider || this.defaultProvider;
    const start = Date.now();

    if (selectedProvider === 'deepseek' && this.deepseekKey) {
      const response = await this.deepseekChat(messages);
      return {
        ...response,
        stats: {
          ...response.stats,
          latencyMs: Date.now() - start
        }
      };
    }

    const response = await this.ollamaChat(messages, model);
    return {
      ...response,
      stats: {
        ...response.stats,
        latencyMs: Date.now() - start
      }
    };
  }

  private async ollamaChat(messages: any[], model: string) {
    try {
      const response = await this.ollama.chat({
        model,
        messages,
        stream: false,
      });
      return {
        message: {
          content: response.message.content,
        },
        stats: {
          tokens: response.eval_count || 0,
          provider: 'local' as const,
          latencyMs: 0 // set by caller
        }
      };
    } catch (error: any) {
      console.error('Ollama Error:', error.message);
      return {
        message: {
          content: "<error>The Local Master is currently in deep meditation (Ollama Offline). Please switch to DeepSeek Cloud or check your local server.</error>",
        },
        stats: { tokens: 0, provider: 'local' as const, latencyMs: 0 }
      };
    }
  }

  private async deepseekChat(messages: any[]) {
    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.deepseekKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        message: {
          content: data.choices[0].message.content,
        },
        stats: {
          tokens: data.usage.total_tokens || 0,
          provider: 'deepseek' as const,
          latencyMs: 0 // set by caller
        }
      };
    } catch (error: any) {
      console.error('DeepSeek Error:', error.message);
      return {
        message: {
          content: "<error>The Cloud Master is currently unreachable (DeepSeek API Error). Please check your API key or connection.</error>",
        },
        stats: { tokens: 0, provider: 'deepseek' as const, latencyMs: 0 }
      };
    }
  }
}
