<script lang="ts">
	import type { Opcion, PreguntaUnica } from '$lib/types';

	import { DEFAULT_TEXTO_OTROS } from '$lib/components/encuesta/preguntas';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Radio from '$lib/components/ui/radio-group';

	type Props = {
		pregunta: PreguntaUnica;
		onupdate: (respuesta: PreguntaUnica['respuesta']) => void;
	};

	let { pregunta, onupdate = () => {} }: Props = $props();

	let opciones: Opcion[] = $state([]);
	let checked: string = $state('');

	const OTHER_VALUE = '__OTHER__';
	let other = $state('');

	// init checked from respuesta
	function initState() {
		checked = pregunta.respuesta || '';
		opciones = pregunta.opciones.map((op) => (typeof op === 'object' ? op : { titulo: op }));

		// check is it's an other option
		const respuesta = pregunta.respuesta || '';
		if (!respuesta) {
			checked = '';
		} else if (opciones.find((opcion) => opcion.titulo === respuesta)) {
			checked = respuesta;
		} else {
			checked = OTHER_VALUE;
			other = respuesta;
		}
	}

	initState();

	let respuesta = $derived(checked === OTHER_VALUE ? other : checked);

	$effect(() => onupdate(respuesta));
</script>

<Radio.Root bind:value={checked} class="gap-0 space-y-4">
	{#each opciones as { titulo, descripcion }, index}
		{@const id = `opcion_${index}`}
		<div class="flex items-center space-x-3">
			<Radio.Item {id} value={titulo} class="self-start" />
			<Label class="flex flex-col space-y-1" for={id}>
				<div>{titulo}</div>
				{#if descripcion}
					<div class="text-xs font-normal text-muted-foreground">{descripcion}</div>
				{/if}
			</Label>
		</div>
	{/each}

	{#if pregunta.acepta_otros}
		<div class="flex items-center space-x-3">
			<Radio.Item id="option-other" value={OTHER_VALUE} class="--self-start" />
			<div class="w-full space-y-1">
				<Input
					bind:value={other}
					placeholder={pregunta.texto_otros || DEFAULT_TEXTO_OTROS}
					onkeyup={() => {
						if (other) checked = OTHER_VALUE;
					}}
				/>
			</div>
		</div>
	{/if}
</Radio.Root>
