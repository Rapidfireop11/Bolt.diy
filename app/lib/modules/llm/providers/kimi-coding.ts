import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default class KimiCodingProvider extends BaseProvider {
  name = 'KimiCoding';
  getApiKeyLink = 'https://www.kimi.com/code/console';

  config = {
    apiTokenKey: 'KIMI_CODING_API_KEY',
    baseUrl: 'https://api.kimi.com/coding/v1',
  };

  staticModels: ModelInfo[] = [
    {
      name: 'kimi-for-coding',
      label: 'Kimi For Coding',
      provider: 'KimiCoding',
      maxTokenAllowed: 262144,
    },
  ];

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '',
      defaultApiTokenKey: 'KIMI_CODING_API_KEY',
    });

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    const openai = createOpenAI({
      baseURL: 'https://api.kimi.com/coding/v1',
      apiKey,
      headers: {
        'User-Agent': 'claude-code/1.0',
      },
    });

    return openai(model);
  }
}
