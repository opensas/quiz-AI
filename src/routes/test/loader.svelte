<div
	id="queue-overlay"
	class="absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-lg border border-black/5 bg-white p-4 opacity-100 transition-opacity duration-300"
>
	<div class="mx-auto max-w-md rounded-lg border bg-white p-8 text-center dark:bg-zinc-900">
		<h2
			id="error-title"
			class="mb-4 py-3 text-xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100"
		>
			You're in the Queue
		</h2>
		<p class="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
			We're facing a high-volume of requests.<br />Please wait or upgrade to get priority access.
		</p>
		<div class="flex justify-center py-3">
			<svg
				class="h-6 w-6 animate-spin opacity-70"
				fill="currentColor"
				viewBox="0 0 256 256"
				xmlns="http://www.w3.org/2000/svg"
				><path
					d="M232 128a104 104 0 0 1-208 0c0-41 23.81-78.36 60.66-95.27a8 8 0 0 1 6.68 14.54C60.15 61.59 40 93.27 40 128a88 88 0 0 0 176 0c0-34.73-20.15-66.41-51.34-80.73a8 8 0 0 1 6.68-14.54C208.19 49.64 232 87 232 128Z"
				></path></svg
			>
		</div>
		<div class="flex justify-center gap-2 py-3 text-sm leading-5 text-zinc-600 dark:text-zinc-300">
			<button
				class="inline-flex h-8 shrink-0 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
				>Cancel</button
			><button
				class="inline-flex h-8 shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
				>Upgrade and Skip Queue</button
			>
		</div>
	</div>
</div>
