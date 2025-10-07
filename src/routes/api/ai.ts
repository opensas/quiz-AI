export const AI_PROVIDERS = ['groq', 'ollama'];

export type AI_Provider = (typeof AI_PROVIDERS)[number];

export const AI_DEFAULTS = {
	PROVIDER: 'groq' as AI_Provider,
	GROQ: {
		URL: 'https://api.groq.com/openai/v1/chat/completions',
		MODEL: 'moonshotai/kimi-k2-instruct-0905'
	},
	OLLAMA: {
		URL: 'http://localhost:11434/api/chat',
		MODEL: 'llama3.2:1b'
	}
} as const;

export const DEFAULT_EXTRA_PARAMS = {
	// extra params
	stream: false,
	temperature: 0.5, // randomness (0 = deterministic, 1 = more creative/random)
	max_tokens: 8192, // max tokens the model can generate in the response
	top_p: 0.5, // Nucleus sampling (0-1, lower values make output more focused)
	frequency_penalty: 0.1, // reduces repetition of frequent tokens(0 = no penalty, higher = more penalty)
	presence_penalty: 0.1 // reduces repetition of any tokens regardless of frequency
};

// groq supported models, see: https://console.groq.com/docs/models#production-models
// groq models that support json_schema: see https://console.groq.com/docs/structured-outputs#supported-models
// openai/gpt-oss-20b (production)
// meta-llama/llama-4-scout-17b-16e-instruct
// moonshotai/kimi-k2-instruct-0905

// ollama models, see https://ollama.com/library?sort=popular
// llama3.2:1b

export type ApiChatBody = {
	provider?: AI_Provider;
	url?: string;
	key?: string;
} & Omit<GroqChatBody, 'model'> & {
		model?: string; // model is optional in APIChatBody, it has a default value
	};

export type JSONSchema = {
	additionalProperties?: boolean;
	properties?: Record<string, unknown>;
	required?: string[];
	type: 'object' | 'string';
};

// openai api compatible body
type GroqChatBody = {
	model: string;
	messages: { role: 'system' | 'user'; content: string }[];
	response_format?: {
		type: 'json_schema' | 'json_object' | 'text';
		json_schema: {
			name?: string;
			strict?: boolean;
			schema: JSONSchema;
		};
	};
	stream?: boolean; // streaming responses

	// Generation options
	temperature?: number; // randomness
	top_p?: number; // nucleus sampling
	stop?: string[]; // stop sequences
	seed?: number; // reproducibility (recently supported in OpenAI)

	max_tokens?: number; // maximum new tokens

	presence_penalty?: number; // discourage repetition of concepts
	frequency_penalty?: number; // discourage repetition of words
};

type OllamaChatBody = {
	model: string;
	messages: { role: 'system' | 'user'; content: string }[];
	format?: 'json' | 'text' | JSONSchema;
	stream?: boolean; // streaming responses
	options?: {
		temperature?: number; // randomness
		top_p?: number; // nucleus sampling
		stop?: string[]; // stop sequences
		seed?: number; // reproducibility

		num_predict?: number; // max new tokens (like max_tokens)

		top_k?: number; // top-k sampling (extra vs OpenAI)
		repeat_penalty?: number; // repetition control
		mirostat?: number; // enable mirostat (0, 1, or 2)
		mirostat_tau?: number; // target entropy
		mirostat_eta?: number; // learning rate for mirostat
	};
};

type OllamaGenerateBody = Omit<OllamaChatBody, 'messages'> & {
	prompt: string;
};

export function groqToOllamaChat(groqBody: GroqChatBody): OllamaChatBody {
	const { model, messages, response_format, stream, max_tokens, ...rest } = groqBody;

	// relax Options type for unknown keys
	type Options = OllamaChatBody['options'] & Record<string, unknown>;

	const options = { ...rest } as Options;

	if (max_tokens !== undefined) options.num_predict = max_tokens;

	if (rest.presence_penalty || rest.frequency_penalty) {
		options.repeat_penalty = 1 + (rest.presence_penalty ?? 0) + (rest.frequency_penalty ?? 0);
	}

	let format: OllamaChatBody['format'] | undefined;
	if (response_format) {
		if (response_format.type === 'text') format = 'text';
		if (response_format.type === 'json_object') format = 'json';
		if (response_format.type === 'json_schema') {
			format = response_format.json_schema?.schema ?? 'json';
		}
	}

	return { model, messages, format, stream, options } satisfies OllamaChatBody;
}

export function groqToOllamaGenerate(groqBody: GroqChatBody): OllamaGenerateBody {
	const ollamaChatBody = groqToOllamaChat(groqBody);

	const { messages, ...rest } = ollamaChatBody;

	const prompt = messages.map((m) => m.content).join('\n\n');

	return { prompt, ...rest } satisfies OllamaGenerateBody;
}
