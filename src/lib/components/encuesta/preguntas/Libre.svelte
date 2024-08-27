<script lang="ts">
	import type { PreguntaLibre } from '$lib/types';

	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';

	type Respuesta = PreguntaLibre['respuesta'];
	type Props = {
		pregunta: PreguntaLibre;
		respuesta?: Respuesta;
		onupdate?: (respuesta: Respuesta) => void;
	};

	let { pregunta, respuesta = $bindable(''), onupdate = () => {} }: Props = $props();

	let { titulo, descripcion } = $derived(pregunta);

	$effect(() => onupdate(respuesta));
</script>

<div class="grid w-full gap-1.5">
	<Label for="opcion-libre">{titulo}</Label>
	<Textarea id="opcion-libre" bind:value={respuesta} placeholder="Type your message here." />
	{#if descripcion}
		<p class="text-sm text-muted-foreground">{descripcion}</p>
	{/if}
</div>
