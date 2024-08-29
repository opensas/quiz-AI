<script lang="ts">
	import type { Encuesta } from '$lib/types';

	import Confetti from '$lib/components/encuesta/Confetti.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';

	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	type Props = {
		open?: boolean;
		encuesta: Encuesta;
		onclose?: () => void;
	};

	const { open = true, encuesta, onclose = () => {} }: Props = $props();

	const preguntas = $derived(encuesta.preguntas.length);
	const correctas = $derived(encuesta.preguntas.filter((p) => p.respuesta === p.solucion).length);

	let confetti = $state(false);
	const puntaje = tweened(0, { duration: 1500, easing: cubicOut });
	$effect(() => {
		puntaje.set((correctas * 100) / preguntas).then(() => (confetti = true));
	});

	const resultados = encuesta.preguntas.map(({ titulo: preg, solucion: s, respuesta: resp }) => {
		return `${preg}: ${resp} ` + (s === resp ? '✅' : `❌ => ${s} ✅`);
	});
	console.log({ resultados });

	const round = (num: number) => Math.round(num * 100) / 100;
</script>

<Dialog.Root closeOnEscape={false} closeOnOutsideClick={false} {open}>
	<Dialog.Content hideCloseButton>
		<div class="grid gap-4 self-center justify-self-center py-2 text-center">
			<div class="grid gap-2">
				<div class="text text-5xl font-black">Felicitaciones</div>
				<div class="text-base text-muted-foreground">
					Acertaste {correctas} de {preguntas} preguntas y te sacaste un
				</div>
			</div>

			<div class="grid animate-shake gap-2">
				<div class="text-8xl font-bold tracking-tighter">{round($puntaje)}%</div>
				<div class="text-sm uppercase text-muted-foreground">Puntaje</div>
			</div>
		</div>

		<Confetti infinite show={confetti} />

		<Dialog.Close class="focus:outline-none">
			<Button class="--focus:outline-none w-full" type="submit" onclick={onclose}>
				Volver a jugar
			</Button>
		</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>
