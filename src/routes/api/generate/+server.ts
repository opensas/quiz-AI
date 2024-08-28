import { error } from '@sveltejs/kit';

import { OLLAMA_URL, OPENAI_KEY, OPENAI_URL } from '$env/static/private';

import { AI_DEFAULT_MODEL, AI_DEFAULT_PROVIDER } from './ai';

export const POST = async ({ request }) => {
	const data = await request.json();

	try {
		if (!data) throw new Error('Request data missing');

		const provider = data?.provider || AI_DEFAULT_PROVIDER;
		const model = data?.model || AI_DEFAULT_MODEL;

		const system = data?.system || '';
		// const user = data?.system || ''
		const user = data?.system || 'Las 3 mejores ciudades del mundo para visitar, solo la lista';

		if (!system && !user) throw new Error('No system not user specified');

		if (provider === 'open-ai') {
			if (!OPENAI_KEY) throw new Error('OPENAI_KEY env var not set');
			if (!OPENAI_URL) throw new Error('OPENAI_URL env var not set');

			const messages = [];

			if (system) messages.push({ role: 'system', content: system });
			if (user) messages.push({ role: 'user', content: user });

			const body = JSON.stringify({
				model,
				messages,
				stream: false,
				temperature: 1,
				max_tokens: 1192,
				top_p: 1,
				frequency_penalty: 0,
				presence_penalty: 0,
				response_format: { type: 'text' }
			});

			const response = await fetch(OPENAI_URL, {
				headers: {
					Authorization: `Bearer ${OPENAI_KEY}`,
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

			console.log('!!!', { provider, model, system, user });
			console.log('!!!', { body: response.body });

			// 'Content-Type': 'text/event-stream'
			return new Response(response.body, {
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}

		if (provider === 'ollama') {
			if (!OLLAMA_URL) throw new Error('OLLAMA_URL env var not set');
		}
	} catch (err) {
		console.error(err);
		throw error(500, 'An error occurred');
	}
};
