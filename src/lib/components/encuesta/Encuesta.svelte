<script lang="ts">
	import type { Encuesta } from '$lib/types';

	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	import { cn } from '$lib/utils';

	import Confetti from './Confetti.svelte';
	// import { Confetti } from 'svelte-confetti';
	import { Libre, Multiple, Puntaje, Unica } from './preguntas';

	type Props = {
		encuesta: Encuesta;
		onsave: (encuesta: Encuesta) => void;
		class?: string;
	};

	let { encuesta = $bindable(), onsave = () => {}, class: className = '' }: Props = $props();

	let current = $state(0);
	let pregunta = $derived(encuesta.preguntas[current]);

	function onupdate(respuesta: Encuesta['preguntas'][number]['respuesta']) {
		pregunta.respuesta = respuesta;
	}

	let status: 'contestando' | 'vacio' | 'correcta' | 'incorrecta' | 'desconocido' =
		$state('contestando');

	function answer() {
		const { solucion, respuesta } = pregunta;

		if (!respuesta) {
			status = 'vacio';
			setTimeout(() => (status = 'contestando'), 1300);
			return;
		}

		status = !solucion ? 'desconocido' : solucion === respuesta ? 'correcta' : 'incorrecta';
		if (isLast) onsave(encuesta);

		// no animation
		if (status === 'desconocido') {
			status = 'contestando';
			current++;
		}
		// wait for animation to finish
		if (status === 'correcta' || status === 'incorrecta') {
			setTimeout(() => ((status = 'contestando'), current++), 1300);
		}
	}

	const isLast = $derived(current === encuesta.preguntas.length - 1);
</script>

<div
	class={cn('rounded-[0.5rem] bg-background sm:border sm:shadow-xl', className)}
	class:animate-shake={status === 'vacio' || status === 'incorrecta'}
>
	<div class="space-y-6 p-6 sm:p-10 md:block">
		<div class="space-y-1">
			<h2 class="text-2xl font-bold tracking-tight">{encuesta.titulo}</h2>
			{#if encuesta.descripcion}
				<p class="text-muted-foreground">{encuesta.descripcion}</p>
			{/if}
		</div>

		<Separator class="my-6" />

		<div class="space-y-0.5">
			<h3 class="text-lg font-medium">{current + 1}. {pregunta.titulo}</h3>
			{#if pregunta.descripcion}
				<p class="text-sm text-muted-foreground">{pregunta.descripcion}</p>
			{/if}
		</div>

		<!-- warning: DO NOT REMOVE THIS #key: option is not being reinitialized if component is not recreated! -->
		{#key pregunta.id}
			{#if pregunta.tipo === 'multiple'}
				<Multiple {pregunta} {onupdate} />
			{:else if pregunta.tipo === 'unica'}
				<Unica {pregunta} {onupdate} />
			{:else if pregunta.tipo === 'puntaje'}
				<Puntaje {pregunta} {onupdate} />
			{:else if pregunta.tipo === 'libre'}
				<Libre {pregunta} {onupdate} />
			{/if}
		{/key}

		<div class="flex justify-between pt-4">
			<Button class={current <= 0 ? 'invisible' : ''} variant="outline" on:click={() => current--}>
				Anterior
			</Button>
			<Button on:click={answer}>{isLast ? 'Finalizar' : 'Siguiente'}</Button>
		</div>
	</div>
</div>

<Confetti show={status === 'correcta'} />
