export const AI_PROVIDERS = ['groq', 'ollama'];

export type AI_Provider = (typeof AI_PROVIDERS)[number];

export const AI_DEFAULTS = {
	PROVIDER: 'groq' as AI_Provider,
	GROQ: {
		URL: 'https://api.groq.com/openai/v1/chat/completions',
		MODEL: 'moonshotai/kimi-k2-instruct-0905'
	},
	OLLAMA: {
		URL: 'http://localhost:11434/api/generate',
		MODEL: 'llama3.2:1b'
	}
} as const;

// groq supported models, see: https://console.groq.com/docs/models#production-models
// groq models that support json_schema: see https://console.groq.com/docs/structured-outputs#supported-models
// openai/gpt-oss-20b (production)
// meta-llama/llama-4-scout-17b-16e-instruct
// moonshotai/kimi-k2-instruct-0905

// ollama models, see https://ollama.com/library?sort=popular
// llama3.2:1b
