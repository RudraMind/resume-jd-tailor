import { LLMAdapter } from '../adapter.js';
import { extractJSON } from '../json-extractor.js';

export class OpenAICompatAdapter extends LLMAdapter {
  constructor(apiKey, model, baseUrl = 'https://api.openai.com/v1') {
    super();
    this.apiKey = apiKey;
    this.model = model;
    this.baseUrl = baseUrl;
  }

  async completeJSON(systemPrompt, userContent, options = {}) {
    const data = await this._call(systemPrompt, userContent, {
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 8192,
      response_format: { type: 'json_object' },
    });
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('OpenAI-compatible API returned empty response');
    return extractJSON(text);
  }

  async completeText(systemPrompt, userContent, options = {}) {
    const data = await this._call(systemPrompt, userContent, {
      temperature: options.temperature ?? 0.5,
      max_tokens: options.maxTokens ?? 4096,
    });
    return data.choices?.[0]?.message?.content || '';
  }

  async _call(systemPrompt, userContent, genConfig) {
    const url = `${this.baseUrl}/chat/completions`;
    const body = {
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      ...genConfig,
    };

    let lastError;
    for (let attempt = 0; attempt <= 2; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify(body),
        });

        if (response.status === 429) {
          const waitMs = Math.min(1000 * Math.pow(2, attempt), 10000);
          await new Promise(r => setTimeout(r, waitMs));
          continue;
        }

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`API ${response.status}: ${errBody}`);
        }

        return await response.json();
      } catch (err) {
        lastError = err;
        if (attempt < 2) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
    throw lastError;
  }
}
