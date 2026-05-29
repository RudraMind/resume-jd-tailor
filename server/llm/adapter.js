export class LLMAdapter {
  async completeJSON(systemPrompt, userContent, options = {}) {
    throw new Error('completeJSON not implemented');
  }

  async completeText(systemPrompt, userContent, options = {}) {
    throw new Error('completeText not implemented');
  }
}
