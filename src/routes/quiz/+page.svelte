<script lang="ts">
	import { type Encuesta as EncuestaType } from '$lib/types';

	import { Encuesta } from '$lib/components/encuesta';

	import { Error, Generate } from './dialogs';
	import { configuration, generateCuestionario } from './quiz';

	type Status = 'configure' | 'generate' | 'play' | 'result' | 'error';

	let status = $state<Status>('configure');
	let encuesta = $state<EncuestaType>();

	const RETRIES = 2;

	async function createCuestionario() {
		const resp = configuration.preguntas.map((p) => p.respuesta);
		const [tema, preguntas, tono, dificultad] = resp;

		status = 'generate';

		let attempt = 1;
		while (attempt <= RETRIES) {
			try {
				encuesta = await generateCuestionario(tema, preguntas, tono, dificultad);
				status = 'play';
				return;
			} catch (e) {
				console.error('!!! error al generar respuesta', { attempt, e });
				attempt++;
			}
		}
		status = 'error';
	}

	function showResult() {
		if (!encuesta) return;

		const correctas = encuesta.preguntas.filter((p) => p.respuesta === p.solucion).length;

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

		const resultados = encuesta.preguntas.map(({ titulo: p, solucion: s, respuesta: r }) => {
			return `${p}: ${s} ` + (s === r ? '✅' : `❌ => ${r}`);
		});
		console.log({ resultados });

		alert(text);

		status = 'configure';
	}
</script>

<div class="flex h-screen items-center justify-center px-2 sm:px-10">
	{#if status === 'configure'}
		<Encuesta class="lg:max-w-5xl" encuesta={configuration} onsave={createCuestionario} />
	{:else if status === 'generate'}
		<Generate />
	{:else if status === 'error'}
		<Error onclose={() => (status = 'configure')} />
	{:else if status === 'play' && encuesta}
		<Encuesta class="lg:max-w-5xl" {encuesta} onsave={showResult} />
	{/if}
</div>
