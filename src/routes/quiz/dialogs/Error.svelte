<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';

	type Props = {
		open?: boolean;
		onclose?: () => void;
	};

	const { open = true, onclose = () => {} }: Props = $props();
</script>

<Dialog.Root closeOnEscape={false} closeOnOutsideClick={false} {open}>
	<Dialog.Content hideCloseButton>
		<Dialog.Header>
			<Dialog.Title>Error al generar las preguntas</Dialog.Title>
			<Dialog.Description class="text-nowrap"
				>Algo anduvo mal, por favor volvé a intentarlo.</Dialog.Description
			>
		</Dialog.Header>
		<img
			class="my-4 rounded-full border-0 p-10 dark:bg-red-200"
			alt="IA generando preguntas"
			height="480"
			src="/img/error/error.png"
			title="IA generando preguntas"
			width="640"
		/>
		<Dialog.Close>
			<Button class="w-full" type="submit" onclick={onclose}>Volver a intentar</Button>
		</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>
