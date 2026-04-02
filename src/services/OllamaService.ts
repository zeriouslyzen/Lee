import { Ollama } from 'ollama';

export class OllamaService {
  private ollama: Ollama;

  constructor(host: string = 'http://127.0.0.1:11434') {
    this.ollama = new Ollama({ host });
  }

  async chat(messages: any[], model: string = 'hermes3:8b', tools: any[] = []) {
    try {
      const response = await this.ollama.chat({
        model,
        messages,
        tools,
        stream: false,
      });
      return response;
    } catch (error) {
      console.error('Ollama Chat Error:', error);
      throw error;
    }
  }

  async embed(text: string, model: string = 'nomic-embed-text') {
    try {
      const response = await this.ollama.embeddings({
        model,
        prompt: text,
      });
      return response.embedding;
    } catch (error) {
      console.error('Ollama Embedding Error:', error);
      throw error;
    }
  }
}
