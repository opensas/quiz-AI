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
			titulo: '¿Qué tono querés que tengan las preguntas?',
			tipo: 'unica',
			respuesta: 'Didáctico',
			opciones: ['Didáctico', 'Enciclopédico', 'Irónico', 'Gracioso']
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

const SYSTEM =
	"Responde con un cuestionario para evaluar conocimientos a modo de juego de preguntas y respuestas. Cada campo de texto puede tener como máxima 30 palabras, salvo las descripciones que pueden tener hasta 300. Se creativo al elegir el título del cuestionario. usa la descripcion para brindar contexto y contenido didáctico acerca del cuestionario y cada pregunta, sin revelar la respuesta. Los nombres de los campos deben estar entre comillas para ser un JSON válido. Utiliza siempre comillas dobles para delimitar los textos, y evita usarlas dentro de los textos. Verifica que la respuesta sea un JSON válido capaz de ser procesado sin errores. Responde únicamente con un JSON válido con esta estructura de TypeScript:\n{\n  id: `enc_${string}` // identificador de cuestionario\n  titulo: string // título del cuestionario\n  descripcion: string\n  preguntas: [\n    id: `preg_${string} // identificador de pregunta\n    {\n      titulo: string // texto de la pregunta\n      descripcion: string // texto de la pregunta\n      tipo: 'unica'\n      opciones: string[]\n      respuesta: string\n    }\n  ]\n}";

const USER =
	"genera un cuestionario sobre '{tema}', con '{preguntas}' preguntas, dificultad '{dificultad}' utilizando un tono sumamente '{tono}'";

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

	console.log({ content: json.choices[0].message.content });

	const cuestionario = parse(json.choices[0].message.content);
	return cuestionario as Encuesta;
}

function parse(content: string) {
	// strip head and tail
	const clean = content.replace(/```json\n/, '').replace(/\n```/, '');
	return JSON.parse(clean);
}
