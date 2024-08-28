<script lang="ts">
	import { type Encuesta as EncuestaType } from '$lib/types';

	import { Encuesta } from '$lib/components/encuesta';

	import { configuration, generateCuestionario } from './quiz';

	type Status = 'configure' | 'generate' | 'play' | 'result';

	let status = $state<Status>('configure');
	let encuesta = $state<EncuestaType>();

	let respuestas: string[] = [];

	async function createCuestionario() {
		const resp = configuration.preguntas.map((p) => p.respuesta);
		const [tema, preguntas, dificultad] = resp;

		status = 'generate';
		encuesta = await generateCuestionario(tema, preguntas, dificultad);

		respuestas = encuesta.preguntas.map((p) => p.respuesta?.toString() || '');
		for (const pregunta of encuesta.preguntas) pregunta.respuesta = undefined;

		status = 'play';
	}

	function showResult() {
		if (!encuesta) return;

		let correctas = 0;
		for (const [index, value] of encuesta.preguntas.entries()) {
			if (value.respuesta === respuestas[index]) correctas++;
		}

		const porcentaje = (correctas / encuesta.preguntas.length) * 100;

		let message = { head: 'Felicitaciones', foot: 'Hasta pronto' };

		if (porcentaje <= 20) message = { head: 'Ouch', foot: 'Seguramente la próxima te irá mejor' };
		else if (porcentaje <= 40)
			message = { head: 'Pasable', foot: 'Tampoco es para ponerse orgulloso...' };
		else if (porcentaje <= 60) message = { head: 'Felicitaciones', foot: 'Buen desempeño' };
		else if (porcentaje <= 90) message = { head: 'Notable!', foot: 'Excelente puntaje' };
		else if (porcentaje > 90)
			message = { head: 'Puntaje perfecto!', foot: 'Dominás ampliamente estos juegos' };

		const text =
			`${message.head}\n\n Acertaste ${correctas} de ${encuesta.preguntas.length} preguntas, ` +
			`eso es un ${porcentaje.toFixed(2)}% de aciertos.\n\n ${message.foot}`;

		const respondidas = encuesta.preguntas.map((p) => p.respuesta);
		console.log({ respuestas, respondidas });

		alert(text);

		status = 'configure';
	}
</script>

<div class="flex h-screen items-center justify-center px-2 sm:px-10">
	{#if status === 'configure'}
		<Encuesta encuesta={configuration} onsave={createCuestionario} />
	{:else if status === 'play' && encuesta}
		<Encuesta {encuesta} onsave={showResult} />
	{/if}
</div>
