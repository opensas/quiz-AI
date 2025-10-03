// src/lib/ai.ts
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "@langchain/schema";

import { jsonSchemaToZod } from "json-schema-to-zod";
import { z, ZodSchema, ZodTypeAny } from "zod";

// --- Constants & types ---
const AI_PROVIDERS = ["openai", "ollama", "groq"] as const;
type AI_Provider = (typeof AI_PROVIDERS)[number];
type JSONSchema = Record<string, any>;

// --- Client creation with validations ---
function createClient() {
	const provider = import.meta.env.VITE_AI_PROVIDER as AI_Provider;
	const model = import.meta.env.VITE_AI_MODEL;
	const apiKey = import.meta.env.VITE_AI_KEY;
	const url = import.meta.env.VITE_AI_URL;

	if (!AI_PROVIDERS.includes(provider)) {
		throw new Error(
			`Invalid AI provider: ${provider}. Must be one of ${AI_PROVIDERS.join(", ")}`
		);
	}
	if (!model) throw new Error("AI model is mandatory. Please set VITE_AI_MODEL.");
	if (provider !== "ollama" && !apiKey) {
		throw new Error(
			`API key is mandatory for provider ${provider}. Please set VITE_AI_KEY.`
		);
	}
	if (url && !isValidUrl(url)) throw new Error(`Invalid URL: ${url}`);

	switch (provider) {
		case "ollama":
			return new ChatOllama({ baseUrl: url || "http://localhost:11434", model });
		case "groq":
			return new ChatGroq({ model, apiKey, baseUrl: url || undefined });
		case "openai":
			return new ChatOpenAI({
				modelName: model,
				apiKey,
				configuration: { baseURL: url || undefined },
			});
		default:
			throw new Error(
				`Unsupported AI provider: ${provider}. Must be one of ${AI_PROVIDERS.join(", ")}`
			);
	}
}

const client = createClient();

// --- generateJSON function ---
export async function generateJSON<S extends ZodSchema<any> | JSONSchema>(
	options: {
		system?: string;
		user?: string;
		schema: S; // mandatory
		maxRetries?: number;
		extraParams?: Record<string, any>;
	}
): Promise<S extends ZodSchema<infer T> ? T : z.infer<ZodSchema<any>>> {
	const { system, user, schema, maxRetries = 2, extraParams = {} } = options;

	if (!schema) throw new Error("Schema is mandatory for generateJSON.");

	// Convert JSON schema to Zod if needed
	const zodSchema: ZodSchema<any> = isZodSchema(schema) ? schema : jsonSchemaToZod(schema);

	// Generate schema instructions for system message
	const schemaInstructions = generateSchemaInstructions(zodSchema);
	const messages = [
		new SystemMessage(`${system ? system + "\n\n" : ""}Return a JSON object matching this schema:\n${schemaInstructions}`),
	];
	if (user) messages.push(new HumanMessage(user));

	// Default parameters to minimize hallucination and randomness
	const defaultParams = {
		temperature: 0,
		topP: 0.0,
		maxTokens: 1024,
		...extraParams,
	};

	// Determine structured client depending on provider
	const provider = import.meta.env.VITE_AI_PROVIDER as AI_Provider;
	const structuredClient =
		supportsJsonSchema(provider)
			? client.withStructuredOutput(zodSchema, defaultParams) // OpenAI / Groq
			: client.withOutputParser(StructuredOutputParser.fromZodSchema(zodSchema)); // Ollama fallback

	// Retry loop for Zod validation failures
	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		const response = await structuredClient.invoke(messages, defaultParams);

		// Extract content
		let content: any;
		if ("choices" in response && Array.isArray(response.choices)) {
			content = response.choices[0]?.message?.content ?? response.choices[0]?.text;
		} else {
			content = response;
		}

		try {
			return zodSchema.parse(typeof content === "string" ? JSON.parse(content) : content);
		} catch (err) {
			if (attempt === maxRetries) throw err;
			// else retry
		}
	}

	throw new Error("generateJSON: unexpected error");
}

// --- Helpers ---
function isZodSchema(obj: any): obj is ZodSchema {
	return obj && typeof obj.parse === "function";
}

function supportsJsonSchema(provider: AI_Provider): boolean {
	return provider === "openai" || provider === "groq";
}

function isValidUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

// Generate human-readable instructions from a Zod schema
function generateSchemaInstructions(zodSchema: ZodSchema<any>): string {
	if (!(zodSchema instanceof z.ZodObject)) return "Schema is not an object";

	const entries = Object.entries((zodSchema as ZodSchema<any> & { shape: any }).shape);
	return entries
		.map(([key, val]) => {
			const type = (val as ZodTypeAny)._def?.typeName || "unknown";
			return `- ${key}: ${type}`;
		})
		.join("\n");
}
