<script lang="ts">
	import type { Encuesta } from '$lib/types';

	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	import { Libre, Multiple, Puntaje, Unica } from './preguntas';

	type Props = {
		encuesta: Encuesta;
		onsave: (encuesta: Encuesta) => void;
	};

	let { encuesta = $bindable(), onsave = () => {} }: Props = $props();

	let current = $state(0);
	let pregunta = $derived(encuesta.preguntas[current]);

	function onupdate(respuesta: Encuesta['preguntas'][number]['respuesta']) {
		pregunta.respuesta = respuesta;
	}
</script>

<div class="rounded-[0.5rem] bg-background sm:border sm:shadow-xl">
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
			{#if current < encuesta.preguntas.length - 1}
				<Button on:click={() => current++}>Siguiente</Button>
			{:else}
				<Button on:click={() => onsave(encuesta)}>Finalizar</Button>
			{/if}
		</div>
	</div>
</div>
