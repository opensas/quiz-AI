<script lang="ts">
	import { cn } from '$lib/utils.js';

	import { fade } from 'svelte/transition';

	import { Dialog as DialogPrimitive } from 'bits-ui';

	type $$Props = DialogPrimitive.OverlayProps;

	let className: $$Props['class'] = undefined;
	export let transition: $$Props['transition'] = fade;
	export let transitionConfig: $$Props['transitionConfig'] = {
		duration: 150
	};
	export { className as class };
</script>

<DialogPrimitive.Overlay
	class={cn('fixed inset-0 z-50 bg-background/80 backdrop-blur-sm', className)}
	{transition}
	{transitionConfig}
	{...$$restProps}
/>
