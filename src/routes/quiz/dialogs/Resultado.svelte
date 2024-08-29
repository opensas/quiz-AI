<script lang="ts">
	import type { Encuesta } from '$lib/types';

	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';

	type Props = {
		open?: boolean;
		encuesta: Encuesta;
		onclose?: () => void;
	};

	const { open = true, encuesta, onclose = () => {} }: Props = $props();

	const preguntas = $derived(encuesta.preguntas.length);
	const correctas = $derived(encuesta.preguntas.filter((p) => p.respuesta === p.solucion).length);
	const puntaje = $derived((correctas * 100) / preguntas);

	const resultados = encuesta.preguntas.map(({ titulo: preg, solucion: s, respuesta: resp }) => {
		return `${preg}: ${resp} ` + (s === resp ? '✅' : `❌ => ${s} ✅`);
	});

	const round = (num: number) => (num % 1 !== 0 ? num.toFixed(2) : num);

	console.log({ resultados });
</script>

<Dialog.Root closeOnEscape={false} closeOnOutsideClick={false} {open}>
	<Dialog.Content hideCloseButton>
		<div class="grid gap-4 self-center justify-self-center py-2 text-center">
			<div class="grid gap-2">
				<div class="text text-5xl font-black">Felicitaciones</div>
				<div class="text-muted-foreground text-base">
					Acertaste {correctas} de {preguntas} preguntas y se sacaste un
				</div>
			</div>

			<div class="animate-shake grid gap-2">
				<div class="text-8xl font-bold tracking-tighter">{round(puntaje)}%</div>
				<div class="text-muted-foreground text-sm uppercase">Puntaje</div>
			</div>
		</div>
		<Dialog.Close class="focus:outline-none">
			<Button class="--focus:outline-none w-full" type="submit" onclick={onclose}>
				Volver a jugar
			</Button>
		</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>
