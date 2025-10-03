import { error } from '@sveltejs/kit';

import { AI_KEY, AI_MODEL, AI_URL } from '$env/static/private';

import { AI_DEFAULTS, type AI_Provider, AI_PROVIDERS } from './ai';

type Body = {
	provider?: AI_Provider;
	url?: string;
	key?: string;
	model?: string;
	system?: string;
	user?: string;
	schema?: object;
};

export const POST = async ({ request }) => {
	const data = (await request.json()) as Body;

	try {
		if (!data) throw new Error('Request data missing');

		const provider = data?.provider || AI_DEFAULTS.PROVIDER;

		if (!AI_PROVIDERS.includes(provider)) {
			throw new Error(
				`Provider ${provider} not supported, supported providers: ${AI_PROVIDERS.join(', ')}`
			);
		}
		const system = data?.system || '';
		const user = data?.user || '';

		if (!system && !user) throw new Error('No system not user messages specified');

		const schema = data?.schema || null;

		if (provider === 'groq') {
			const url = data?.url || AI_URL || AI_DEFAULTS.GROQ.URL;
			const key = data?.key || AI_KEY;

			if (!key) throw new Error('OPENAI_KEY env var not set');
			const model = data?.model || AI_MODEL || AI_DEFAULTS.GROQ.MODEL;

			const messages = [];

			if (system) messages.push({ role: 'system', content: system });
			if (user) messages.push({ role: 'user', content: user });

			const response_format = schema
				? { type: 'json_schema', json_schema: schema }
				: { type: 'text' };

			const body = JSON.stringify({
				model,
				messages,
				stream: false,
				temperature: 1,
				max_tokens: 4096,
				top_p: 1,
				frequency_penalty: 0,
				presence_penalty: 0,
				response_format
			});
			// console.log('!!!', { body });

			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${key}`,
					'Content-Type': 'application/json'
				},
				method: 'POST',
				body
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
			const url = AI_URL || AI_DEFAULTS.OLLAMA.URL;
			const model = data?.model || AI_MODEL || AI_DEFAULTS.OLLAMA.MODEL;

			console.log('ollama', { url, model });
			// #TODO - ollama support
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
