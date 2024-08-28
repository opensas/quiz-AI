import type { Encuesta } from '$lib/types';

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
			acepta_otros: true
		},
		{
			id: 'preg_002',
			titulo: '¿Cuántas preguntas querés responder',
			tipo: 'unica',
			respuesta: '3',
			opciones: ['3', '4', '5']
		},
		{
			id: 'preg_003',
			titulo: '¿Qué nivel de dificultad te animás a enfrentar?',
			tipo: 'unica',
			respuesta: 'Normal',
			opciones: ['Fácil', 'Normal', 'Difícil', 'Muy difícil']
		}
	]
} satisfies Encuesta;

const SYSTEM =
	"Responde únicamente con un JSON con esta estructura de TypeScript. Los 'title' no pueden tener más de 50 palabras. Los 'options' no pueden tener más de 10 palabras.\n{\n  id: `enc_${string}` // identificador quiz\n  codigo: string\n  titulo: string\n preguntas: [\n { id: `preg_${string}`\n titulo: string // texto de la pregunta\ntipo: 'unica'\n      opciones: string[]\n      respuesta: string\n    }\n  ]\n}";
const USER =
	"creá un cuestionario sobre '{tema}', con '{preguntas}' preguntas, dificultad '{dificultad}'";

const GENERATE_URL = '/api/generate';

export async function generateCuestionario(
	tema = 'un tema a tu elección',
	preguntas = '3',
	dificultad = 'normal'
) {
	// ¡Sorprendeme! (deja que la IA elija un tema)
	if (tema === configuration.preguntas[0].opciones[0]) tema = 'un tema a tu elección';

	const user = USER.replace('{tema}', tema)
		.replace('{preguntas}', preguntas)
		.replace('{dificultad}', dificultad);

	const body = JSON.stringify({ system: SYSTEM, user });

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

	const cuestionario = parse(json.choices[0].message.content);
	return cuestionario as Encuesta;
}

function parse(content: string) {
	// strip head and tail
	const clean = content.replace(/```json\n/, '').replace(/\n```/, '');
	return JSON.parse(clean);
}
