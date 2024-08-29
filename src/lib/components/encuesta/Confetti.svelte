<script lang="ts">
	import { cn } from '$lib/utils';

	import type { ComponentProps } from 'svelte';
	import Confetti from 'svelte-confetti';

	type ConfettiProps = ComponentProps<typeof Confetti>;

	type Props = {
		show?: boolean;
		scale?: number;
		duration?: ConfettiProps['duration'];
		size?: ConfettiProps['size'];
		class?: string;
	};

	let {
		show = false,
		scale = 2,
		duration = 1200,
		size = 15,
		class: className = ''
	}: Props = $props();
</script>

{#if show}
	<div class={cn('absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2', className)}>
		<Confetti
			colorArray={['#6CCFF6']}
			{duration}
			{size}
			x={[scale * -1, scale * 1]}
			y={[scale * 1.25, scale * 1.5]}
		/>
		<Confetti
			colorArray={['white']}
			{duration}
			{size}
			x={[scale * -1, scale * 1]}
			y={[scale * 1, scale * 1.25]}
		/>
		<Confetti
			colorArray={['#F7D417']}
			{duration}
			{size}
			x={[scale * -0.2, scale * 0.2]}
			y={[scale * 1, scale * 1.25]}
		/>
		<Confetti
			colorArray={['#6CCFF6']}
			{duration}
			{size}
			x={[scale * -1, scale * 1]}
			y={[scale * 0.75, scale * 1]}
		/>
	</div>
{/if}
