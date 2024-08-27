<script>
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';

	import { QrCode } from 'lucide-svelte';

	import AppQr from './QR.svelte';
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button class="absolute left-4 top-4 z-10" size="icon" variant="outline">
			<QrCode class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 " />
			<span class="sr-only">Escaneá el código QR</span>
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Escaneá el código QR</Dialog.Title>
			<Dialog.Description class="text-nowrap">
				Escaneá para navegar a
				<a href="https://quiz-ai-demo.vercel.app">quiz-ai-demo.vercel.app</a>
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 self-center justify-self-center py-4">
			<AppQr />
		</div>
		<Dialog.Close class="place-self-end self-end">
			<Button type="submit">Cerrar</Button>
		</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>
