import { LLMAdapter } from '../adapter.js';
import { extractJSON } from '../json-extractor.js';

export class GeminiAdapter extends LLMAdapter {
  constructor(apiKey, model = 'gemini-2.0-flash') {
    super();
    this.apiKey = apiKey;
    this.model = model;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  }

  async completeJSON(systemPrompt, userContent, options = {}) {
    const url = `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`;
    const body = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userContent }] }],
      generationConfig: {
        temperature: options.temperature ?? 0.3,
        maxOutputTokens: options.maxTokens ?? 8192,
        responseMimeType: 'application/json',
      },
    };

    const res = await this._fetchWithRetry(url, body);
    const text = res.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini returned empty response');
    return extractJSON(text);
  }

  async completeText(systemPrompt, userContent, options = {}) {
    const url = `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`;
    const body = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userContent }] }],
      generationConfig: {
        temperature: options.temperature ?? 0.5,
        maxOutputTokens: options.maxTokens ?? 4096,
      },
    };

    const res = await this._fetchWithRetry(url, body);
    return res.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  async _fetchWithRetry(url, body, maxRetries = 2) {
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (response.status === 429) {
          const waitMs = Math.min(1000 * Math.pow(2, attempt), 10000);
          await new Promise(r => setTimeout(r, waitMs));
          continue;
        }

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`Gemini API ${response.status}: ${errBody}`);
        }

        return await response.json();
      } catch (err) {
        lastError = err;
        if (attempt < maxRetries) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    }
    throw lastError;
  }
}
