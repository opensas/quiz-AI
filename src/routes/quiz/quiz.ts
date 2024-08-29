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
			acepta_otros: true
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

const SYSTEM = oneLine`

	Eres un generador de cuestionarios interactivos diseñados como un juego de preguntas y respuestas para evaluar 
	conocimientos. Tu tarea es crear cuestionarios en formato JSON que sean válidos y puedan ser procesados 
	sin errores. Asegúrate de seguir las siguientes instrucciones:

	1. *Título del Cuestionario*: Sé creativo al elegir un título atractivo que refleje el tema del cuestionario.

	2. *Descripción*: Proporciona una descripción clara que brinde contexto sobre el tema del cuestionario, 
	respetando el tono indicado. Limita la descripción a un máximo de 300 palabras.

	3. *Estructura del JSON*: Responde únicamente con un JSON con la siguiente estructura de TypeScript:

	{
		"id": "enc_\${string}",  // identificador de cuestionario
		"titulo": string,       // título del cuestionario, max 30 palabras
		"descripcion": string,  // contexto y contenido didáctico del cuestionario, max 300 palabras
		"preguntas": [          // lista de preguntas
			{
				"id": "preg_\${string}",   // identificador de pregunta
				"titulo": string,         // texto de la pregunta, max 30 palabras
				"descripcion": string,    // descripción didáctica de la pregunta, max 300 palabras
				"tipo": "unica",          // tipo de pregunta (única opción correcta)
				"opciones": string[],     // lista de opciones
				"solucion": string        // respuesta correcta
			}
		]
	}

	Aquí tienen un ejemplo de un cuestionario sobre 'la historia geológica de la Tierra' con '2' preguntas, dificultad 'Normal' utilizando un tono sumamente 'Didáctico':
	{
		"id": "enc_001",
		"titulo": "Explorando la Historia de la Tierra",
		"descripcion": "Este cuestionario te llevará a través de aspectos fascinantes de la historia geológica de la Tierra.",
		"preguntas": [
			{
				"id": "preg_001",
				"titulo": "¿Cuál es la era geológica más antigua de la Tierra?",
				"descripcion": "La historia de la Tierra se divide en diferentes eras geológicas.",
				"tipo": "unica",
				"opciones": ["Paleozoica", "Mesozoica", "Cenozoica", "Hadeana"],
				"solucion": "Hadeana"
			},
			{
				"id": "preg_002",
				"titulo": "¿Qué fenómeno geológico es responsable de la creación de montañas?",
				"descripcion": "Comprender cómo se forman las montañas nos ayuda a conocer los procesos tectónicos que moldean nuestro planeta.",
				"tipo": "unica",
				"opciones": ["Erosión", "Tectónica de placas", "Volcanismo", "Sedimentación"],
				"solucion": "Tectónica de placas"
			},
		]
	}

	4. Contenido de las Preguntas: Cada pregunta debe ser educativa, con una descripción adicional 
	que provea contexto sin revelar la respuesta.Limita las descripciones a un máximo de 300 palabras.

	5. Respuestas y Opciones: Incluye entre 3 y 5 opciones distintas para cada pregunta, con solo una 
	opción correcta.Limita las opciones a un máximo de 30 palabras por cada opción.

	6. Formato de salida: Responde únicamente con un JSON válido siguiendo la estructura indicada. 
	Verifica que el JSON esté correctamente formateado y sin errores de sintaxis.

		6.1 Los nombres de los campos deben estar entre comillas dobles para ser un JSON válido. 
		Utiliza siempre comillas dobles para delimitar los campos de texto.
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

	const body = JSON.stringify({ system: SYSTEM, user });

	console.log('!!! about to hit /api/generate', { body });

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
	console.log('!!! response from /api/generate, about to parse', { content });

	const cuestionario = parse(content);
	return cuestionario as Encuesta;
}

function parse(content: string) {
	// strip head and tail
	const clean = content.replace(/```json\n/, '').replace(/\n```/, '');
	return JSON.parse(clean);
}
