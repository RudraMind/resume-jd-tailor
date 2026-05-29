import { LLMAdapter } from '../adapter.js';
import { extractJSON } from '../json-extractor.js';

export class AnthropicAdapter extends LLMAdapter {
  constructor(apiKey, model = 'claude-sonnet-4-20250514') {
    super();
    this.apiKey = apiKey;
    this.model = model;
  }

  async completeJSON(systemPrompt, userContent, options = {}) {
    const data = await this._call(systemPrompt, userContent, options);
    const text = data.content?.find(b => b.type === 'text')?.text;
    if (!text) throw new Error('Anthropic returned empty response');
    return extractJSON(text);
  }

  async completeText(systemPrompt, userContent, options = {}) {
    const data = await this._call(systemPrompt, userContent, options);
    return data.content?.find(b => b.type === 'text')?.text || '';
  }

  async _call(systemPrompt, userContent, options = {}) {
    let lastError;
    for (let attempt = 0; attempt <= 2; attempt++) {
      let response;
      try {
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: this.model,
            max_tokens: options.maxTokens ?? 8192,
            temperature: options.temperature,
            system: systemPrompt,
            messages: [{ role: 'user', content: userContent }],
          }),
        });
      } catch (networkErr) {
        lastError = networkErr;
        if (attempt < 2) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }

      if (response.status === 429) {
        lastError = new Error(`Anthropic API 429: rate limited after ${attempt + 1} attempt(s)`);
        const waitMs = Math.min(1000 * Math.pow(2, attempt), 10000);
        await new Promise(r => setTimeout(r, waitMs));
        continue;
      }

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Anthropic API ${response.status}: ${errBody}`);
      }

      return await response.json();
    }
    throw lastError;
  }
}
