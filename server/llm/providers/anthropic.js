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
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: options.maxTokens ?? 8192,
        system: systemPrompt,
        messages: [{ role: 'user', content: userContent }],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Anthropic API ${response.status}: ${errBody}`);
    }

    return await response.json();
  }
}
