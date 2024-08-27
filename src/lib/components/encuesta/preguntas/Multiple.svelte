<script lang="ts">
	import type { Opcion, PreguntaMultiple } from '$lib/types';

	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	type Props = {
		pregunta: PreguntaMultiple;
		onupdate: (respuesta: PreguntaMultiple['respuesta']) => void;
	};

	let { pregunta, onupdate = () => {} }: Props = $props();

	let opciones: Opcion[] = $state([]);
	let respuesta: string[] = [];

	let checked: boolean[] = $state([]);
	let checkedOther: boolean = $state(false);
	let other: string = $state('');

	// init checked from respuesta
	function initState() {
		respuesta = pregunta.respuesta || [];
		onupdate(respuesta);

		opciones = pregunta.opciones.map((op) => (typeof op === 'object' ? op : { titulo: op }));
		const titulos = opciones.map((opcion) => opcion.titulo);

		checked = titulos.map((titulo) => respuesta.includes(titulo));
		other = respuesta.find((r) => !titulos.includes(r)) || '';
		checkedOther = !!other;
	}

	function updateRespuesta(checked: boolean[], checkedOther: boolean, other: string) {
		respuesta = checked
			.map((check, index) => (check ? opciones[index].titulo : null))
			.filter((resp) => resp !== null); // remove unchecked items
		if (checkedOther && other) respuesta.push(other);
		onupdate(respuesta);
	}

	initState();

	$effect(() => updateRespuesta(checked, checkedOther, other));
</script>

<div class="space-y-4">
	{#each opciones as { titulo, descripcion }, index}
		{@const id = `opcion_${index}`}
		<div class="flex items-center space-x-3">
			<Checkbox {id} bind:checked={checked[index]} class="self-start" />
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
			<Checkbox id="opcion_otra" bind:checked={checkedOther} class="--self-start" />
			<div class="w-full space-y-1">
				<Input bind:value={other} --disabled placeholder="otra opción" />
			</div>
		</div>
	{/if}
</div>
