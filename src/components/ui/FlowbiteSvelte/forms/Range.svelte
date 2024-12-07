<script>
	import { twMerge } from 'tailwind-merge';
	export let value;
	export let size = 'md';
	const sizes = {
		sm: 'h-1 range-sm',
		md: 'h-2',
		lg: 'h-3 range-lg'
	};
	let inputClass;
	$: inputClass = twMerge('w-full rounded-lg appearance-none cursor-pointer', sizes[size] ?? sizes.md, $$props.class);
</script>

<input type="range" bind:value {...$$restProps} class={inputClass} on:change on:click on:keydown on:keypress on:keyup />

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Props
@prop export let value: number;
@prop export let size: 'sm' | 'md' | 'lg' = 'md';
-->
