import type { Encuesta } from '$lib/types';

import { oneLine } from 'common-tags';

export const configuration = {
	id: 'enc_001',
	codigo: 'configuracion-cuestionario',
	titulo: 'QUIZ-AI: Formularios generados mediante Inteligencia Artificial ',
	descripcion:
		'Mediante el uso de IA vamos a generar una serie de preguntas para poner a prueba tus conocimientos',
	preguntas: [
		{
			id: 'preg_001',
			titulo: '¿Sobre qué tema querés responder?',
			tipo: 'unica',
			opciones: [
				'¡Sorprendeme! (deja que la IA elija un tema)',
				'Literatura argentina',
				'Historia universal',
				'Ciencia y tecnología',
				'Películas',
				'Ciencia Ficción y Fantasía'
			],
			respuesta: '¡Sorprendeme! (deja que la IA elija un tema)',
			acepta_otros: true,
			texto_otros: 'Ingresa tu tema favorito'
		},
		{
			id: 'preg_002',
			titulo: '¿Cuántas preguntas querés responder',
			tipo: 'unica',
			respuesta: '5',
			opciones: ['3', '4', '5']
		},
		{
			id: 'preg_003',
			titulo: '¿Qué tono querés que tengan las preguntas?',
			tipo: 'unica',
			respuesta: 'Didáctico',
			opciones: ['Didáctico', 'Enciclopédico', 'Irónico', 'Gracioso', 'Disparatado'],
			acepta_otros: true,
			texto_otros: 'Ingresa tu tono favorito (enigmático, melancólico, arrogante, sarcástico, etc.)'

		},
		{
			id: 'preg_004',
			titulo: '¿Qué nivel de dificultad te animás a enfrentar?',
			tipo: 'unica',
			respuesta: 'Normal',
			opciones: ['Fácil', 'Normal', 'Difícil', 'Muy difícil']
		}
	]
} satisfies Encuesta;

const SYSTEM = oneLine`

	Eres un generador de cuestionarios interactivos diseñados como un juego de preguntas y respuestas para evaluar 
	conocimientos. Tu tarea es crear cuestionarios en formato JSON especificado en response_format:

	1. Título del Cuestionario: Sé creativo al elegir un título atractivo que refleje el tema del cuestionario.

	2. Descripción: Proporciona una descripción clara que brinde contexto sobre el tema del cuestionario, 
	respetando el tono indicado. Limita la descripción a un máximo de 100 palabras.

	3. Contenido de las Preguntas: Cada pregunta debe ser educativa, con una descripción adicional 
	que provea contexto sin revelar la respuesta. Cada palabra debe ser de tipo 'unica'.
	Limita las descripciones a un máximo de 100 palabras.

	4. Respuestas y Opciones: Incluye entre 3 y 5 opciones distintas para cada pregunta, con solo una 
	opción correcta. Limita las opciones a un máximo de 30 palabras por cada opción.
`;

const USER =
	"Tu tarea es generar un cuestionario sobre '{tema}', con '{preguntas}' preguntas, dificultad '{dificultad}' utilizando un tono sumamente '{tono}'";

const GENERATE_URL = '/api/generate';

export async function generateCuestionario(
	tema = 'un tema a tu elección',
	preguntas = '3',
	tono = 'neutro',
	dificultad = 'normal'
) {
	// ¡Sorprendeme! (deja que la IA elija un tema)
	if (tema === configuration.preguntas[0].opciones[0]) tema = 'un tema a tu elección';

	const user = USER.replace('{tema}', tema)
		.replace('{preguntas}', preguntas)
		.replace('{tono}', tono)
		.replace('{dificultad}', dificultad);

	const body = JSON.stringify({ system: SYSTEM, user, schema: RESPONSE_JSON_SCHEMA });

	// console.log('!!! about to hit /api/generate', { body });

	const response = await fetch(GENERATE_URL, {
		headers: { 'Content-Type': 'application/json' },
		method: 'POST',
		body
	});

	if (!response.ok) {
		const err = await response.json();
		console.error(err);
		throw new Error('Failed to create cuestionario', err);
	}
	const json = await response.json();

	const content = json.choices[0].message.content;
	console.log('!!! response from /api/generate, about to parse encuesta', { content });

	return JSON.parse(content) as Encuesta;
}

const RESPONSE_JSON_SCHEMA = {
	name: 'cuestionario',
	strict: true,
	schema: {
		type: 'object',
		additionalProperties: false,
		required: ['id', 'titulo', 'descripcion', 'preguntas'],
		properties: {
			id: { type: 'string' },
			titulo: { type: 'string' },
			descripcion: { type: 'string' },
			preguntas: {
				type: 'array',
				items: {
					type: 'object',
					additionalProperties: false,
					required: ['id', 'titulo', 'descripcion', 'tipo', 'opciones', 'solucion'],
					properties: {
						id: { type: 'string' },
						titulo: { type: 'string' },
						descripcion: { type: 'string' },
						tipo: { type: 'string', const: 'unica' },
						opciones: {
							type: 'array',
							items: { type: 'string' }
						},
						solucion: { type: 'string' }
					}
				}
			}
		}
	}
};
