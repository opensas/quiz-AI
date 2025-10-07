import { error } from '@sveltejs/kit';

import { AI_KEY, AI_MODEL, AI_PROVIDER, AI_URL } from '$env/static/private';

import {
	AI_DEFAULTS,
	AI_PROVIDERS,
	type ApiChatBody,
	DEFAULT_EXTRA_PARAMS,
	groqToOllamaChat,
	ollamaToGroqResponse
} from '../ai';

export const POST = async ({ request }) => {
	const body = (await request.json()) as ApiChatBody;

	try {
		if (!body) throw new Error('Request body missing');

		const { provider: _provider, url: _url, key: _key, ...groqBody } = body;

		const provider = _provider || AI_PROVIDER || AI_DEFAULTS.PROVIDER;

		if (!AI_PROVIDERS.includes(provider)) {
			throw new Error(
				`Provider ${provider} not supported, supported providers: ${AI_PROVIDERS.join(', ')}`
			);
		}

		// validate messages
		const messages = groqBody.messages;
		if (!messages) throw new Error('No messages specified');

		if (!Array.isArray(messages)) throw new Error('Messages must be an array');
		if (messages.length <= 0) throw new Error('Messages array is empty');
		if (!messages.some((m) => (m.role === 'system' || m.role === 'user') && m.content)) {
			throw new Error('No system or user message with content found');
		}

		if (provider === 'groq') {
			const url = _url || AI_URL || AI_DEFAULTS.GROQ.URL;
			const key = _key || AI_KEY;

			if (!key) throw new Error('groq api key missing. Check AI_KEY env var');
			// assign default model if not specified
			const model = groqBody.model || AI_MODEL || AI_DEFAULTS.GROQ.MODEL;

			const body = {
				// ...DEFAULT_EXTRA_PARAMS,
				...groqBody,
				model // override model
			};
			console.log('[quiz-AI] groq url and model:', { url, model });
			console.log('[quiz-AI] groq body:', { body });

			console.log('[quiz-AI] groq stringify body:', JSON.stringify(body));

			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${key}`,
					'Content-Type': 'application/json'
				},
				method: 'POST',
				body: JSON.stringify(body)
			});

			if (!response.ok) {
				const err = await response.json();
				console.error(err);
				throw new Error('Failed to create completion', err);
			}

			// 'Content-Type': 'text/event-stream'
			return new Response(response.body, {
				headers: { 'Content-Type': 'application/json' }
			});
		}

		if (provider === 'ollama') {
			const url = _url || AI_URL || AI_DEFAULTS.OLLAMA.URL;
			const model = groqBody.model || AI_MODEL || AI_DEFAULTS.OLLAMA.MODEL;

			const body = groqToOllamaChat({
				...DEFAULT_EXTRA_PARAMS,
				...groqBody,
				model // override model
			});
			console.log('[quiz-AI] ollama url and model:', { url, model });
			console.log('[quiz-AI] ollama body:', { body });

			const response = await fetch(url, {
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'POST',
				body: JSON.stringify(body)
			});

			if (!response.ok) {
				const err = await response.json();
				console.error(err);
				throw new Error('Failed to create completion', err);
			}
			const ollamaResponse = await response.json();
			const groqResponse = ollamaToGroqResponse(ollamaResponse);

			return new Response(JSON.stringify(groqResponse), {
				headers: { 'Content-Type': 'application/json' }
			});
		}
	} catch (err) {
		console.error(err);
		throw error(500, 'An error occurred');
	}
};

/* sample body

{
	"system": "Eres un generador de cuestionarios interactivos diseñados como un juego de preguntas y respuestas para evaluar  conocimientos. Tu tarea es crear cuestionarios en formato JSON especificado en response_format: 1. Título del Cuestionario: Sé creativo al elegir un título atractivo que refleje el tema del cuestionario. 2. Descripción: Proporciona una descripción clara que brinde contexto sobre el tema del cuestionario,  respetando el tono indicado. Limita la descripción a un máximo de 100 palabras. 3. Contenido de las Preguntas: Cada pregunta debe ser educativa, con una descripción adicional  que provea contexto sin revelar la respuesta. Cada palabra debe ser de tipo 'unica'. Limita las descripciones a un máximo de 100 palabras. 4. Respuestas y Opciones: Incluye entre 3 y 5 opciones distintas para cada pregunta, con solo una  opción correcta. Limita las opciones a un máximo de 30 palabras por cada opción.",
	"user": "Tu tarea es generar un cuestionario sobre 'un tema a tu elección', con '5' preguntas, dificultad 'Normal' utilizando un tono sumamente 'Didáctico'",
	"schema": {
		"name": "cuestionario",
		"strict": true,
		"schema": {
			"type": "object",
			"additionalProperties": false,
			"required": [
				"id",
				"titulo",
				"descripcion",
				"preguntas"
			],
			"properties": {
				"id": {
					"type": "string"
				},
				"titulo": {
					"type": "string"
				},
				"descripcion": {
					"type": "string"
				},
				"preguntas": {
					"type": "array",
					"items": {
						"type": "object",
						"additionalProperties": false,
						"required": [
							"id",
							"titulo",
							"descripcion",
							"tipo",
							"opciones",
							"solucion"
						],
						"properties": {
							"id": {
								"type": "string"
							},
							"titulo": {
								"type": "string"
							},
							"descripcion": {
								"type": "string"
							},
							"tipo": {
								"type": "string",
								"const": "unica"
							},
							"opciones": {
								"type": "array",
								"items": {
									"type": "string"
								}
							},
							"solucion": {
								"type": "string"
							}
						}
					}
				}
			}
		}
	}
}
*/
