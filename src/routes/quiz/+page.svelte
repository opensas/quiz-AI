<script lang="ts">
	import { Encuesta } from '$lib/components/encuesta';

	const configuration: import('$lib/types').Encuesta = {
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
				// respuesta: '¡Sorprendeme! (deja que la IA elija un tema)',
				respuesta: 'Películas',
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
	};

	function onsave(encuesta: import('$lib/types').Encuesta) {
		console.log('!encuesta saved!', { encuesta });
		const LF = '\r\n\r\n';
		const respuestas = encuesta.preguntas
			.map((p) => `${p.titulo}: ${(p.respuesta || '').toString()}`)
			.join(LF);
		alert(`Felicitaciones! completaste la encuesta.${LF}${respuestas}`);
	}
</script>

<div class="flex h-screen items-center justify-center px-2 sm:px-10">
	<Encuesta encuesta={configuration} {onsave} />
</div>
