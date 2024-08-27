<script>
	import '../app.css';

	import { Button } from '$lib/components/ui/button';

	import { Moon, Sun } from 'lucide-svelte';
	import { ModeWatcher, toggleMode } from 'mode-watcher';

	import EncuestasQrDialog from './qr/EncuestasQRDialog.svelte';
</script>

<ModeWatcher />

<EncuestasQrDialog />

<Button class="absolute right-4 top-4 z-10" size="icon" variant="outline" on:click={toggleMode}>
	<Sun
		class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
	/>
	<Moon
		class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
	/>
	<span class="sr-only">Toggle theme</span>
</Button>

<slot></slot>
