<script context="module">
	// this part is shared between Radio and Checkbox
	import { twMerge } from 'tailwind-merge';
	const colorClasses = {
		primary: `${window.theme('input')}`
	};
	export const labelClass = (inline, extraClass) => twMerge(inline ? 'inline-flex' : 'flex', 'items-center', extraClass);
	export const inputClass = (custom, color, rounded, tinted, spacing, extraClass) => twMerge(`w-4 h-4 bg-grayyy-100 ${window.theme('border')} ${window.theme('input')}`, spacing, tinted ? `dark:bg-grayyy-600 dark:${window.theme('border')}` : `dark:bg-grayyy-700 dark:${window.theme('border')}`, custom && 'sr-only peer', rounded && 'rounded', colorClasses[color], extraClass);
</script>

<script>
	import { getContext } from 'svelte';
	import Label from './Label.svelte';
	export let color = 'primary';
	export let custom = false;
	export let inline = false;
	export let group = undefined;
	export let value = '';
	export let spacing = $$slots.default ? 'me-2' : '';
	// tinted if put in component having its own background
	let background = getContext('background');
</script>

<Label class={labelClass(inline, $$props.class)} show={$$slots.default}>
	<input type="radio" bind:group on:blur on:change on:click on:focus on:keydown on:keypress on:keyup on:mouseenter on:mouseleave on:mouseover on:paste {value} {...$$restProps} class={inputClass(custom, color, false, background, spacing, $$slots.default || $$props.class)} />
	<slot />
</Label>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Props
@prop export let color: FormColorType = 'primary';
@prop export let custom: boolean = false;
@prop export let inline: boolean = false;
@prop export let group: number | string | undefined = undefined;
@prop export let value: number | string = '';
@prop export let spacing: string = $$slots.default ? 'me-2' : '';
-->
