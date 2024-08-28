<script lang="ts">
	import { type Encuesta as EncuestaType } from '$lib/types';

	import { Encuesta } from '$lib/components/encuesta';

	const configuration = {
		id: 'enc_001',
		codigo: 'configuracion-cuestionario',
		titulo: 'QUIZ-AI: Carrera de mentes + Inteligencia Artificial ',
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
				opciones: ['Fácil', 'Normal', 'Difícil']
			}
		]
	} satisfies EncuestaType;

	function createEncuesta() {
		const tema = configuration.preguntas[0].respuesta;
		const preguntas = configuration.preguntas[1].respuesta;
		const dificultad = configuration.preguntas[2].respuesta;
		console.log({ tema, preguntas, dificultad });
	}
</script>

<div class="flex h-screen items-center justify-center px-2 sm:px-10">
	<Encuesta encuesta={configuration} onsave={createEncuesta} />
</div>
