<script lang="ts">
	import { type Encuesta as EncuestaType } from '$lib/types';

	import { Encuesta } from '$lib/components/encuesta';

	import { Error, Generate, Resultado } from './dialogs';
	import { configuration, generateCuestionario } from './quiz';

	type Status = 'configure' | 'generate' | 'play' | 'result' | 'error';

	let { data } = $props();

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

	function init() {
		const q = data.query;
		if (q.tema) configuration.preguntas[0].respuesta = q.tema;
		if (q.preguntas) configuration.preguntas[1].respuesta = q.preguntas;
		if (q.tono) configuration.preguntas[2].respuesta = q.tono;
		if (q.dificultad) configuration.preguntas[3].respuesta = q.dificultad;
		if (q.play !== undefined) createCuestionario();
	}

	init();
</script>

<div class="flex h-screen items-center justify-center px-2 sm:px-10">
	{#if status === 'configure'}
		<Encuesta class="lg:max-w-5xl" encuesta={configuration} onsave={createCuestionario} />
	{:else if status === 'generate'}
		<Generate />
	{:else if status === 'error'}
		<Error onclose={() => (status = 'configure')} />
	{:else if status === 'play' && encuesta}
		<Encuesta class="lg:max-w-5xl" {encuesta} onsave={() => (status = 'result')} />
	{:else if status === 'result' && encuesta}
		<Resultado {encuesta} onclose={() => (status = 'configure')} />
	{/if}
</div>
