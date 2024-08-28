<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';

	const { open = true } = $props();
</script>

<Dialog.Root closeOnEscape={false} closeOnOutsideClick={false} {open}>
	<Dialog.Content hideCloseButton>
		<Dialog.Header>
			<Dialog.Title>Generando preguntas</Dialog.Title>
			<Dialog.Description class="text-nowrap">Esto puede tardar un rato...</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 self-center justify-self-center py-4">
			<img
				alt="IA generando preguntas"
				height="480"
				src="/img/generating/generating-quiz-01.webp"
				title="IA generando preguntas"
				width="640"
			/>
		</div>
	</Dialog.Content>
</Dialog.Root>
