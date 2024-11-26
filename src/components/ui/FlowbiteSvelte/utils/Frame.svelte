<script>
	import { createEventDispatcher, setContext } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import {} from 'svelte/transition';
	const noop = () => {};
	setContext('background', true);
	export let tag = $$restProps.href ? 'a' : 'div';
	export let color = 'default';
	export let rounded = false;
	export let border = false;
	export let shadow = false;
	// For components development
	export let node = undefined;
	// Action function and its params
	export let use = noop;
	export let options = {};
	export let role = undefined;
	// Export a prop through which you can set a desired svelte transition
	export let transition = undefined;
	// Pass in extra transition params
	export let params = {};
	export let open = true;
	const dispatch = createEventDispatcher();
	$: dispatch(open ? 'open' : 'close');
	$: dispatch('show', open);
	$: color = color ?? 'default'; // for cases when undefined
	$: setContext('color', color);
	// your script goes here
	const bgColors = {
		gray: 'bg-gray-50 dark:bg-gray-800',
		light: 'bg-gray-50 dark:bg-gray-700',
		dark: 'bg-gray-50 dark:bg-gray-800',
		default: 'bg-white dark:bg-gray-800',
		dropdown: 'bg-white dark:bg-gray-700',
		navbar: 'bg-white dark:bg-gray-900',
		navbarUl: 'bg-gray-50 dark:bg-gray-800',
		form: 'bg-gray-50 dark:bg-gray-700',
		primary: 'bg-primary-50 dark:bg-gray-800 ',
		none: ''
	};
	const textColors = {
		gray: 'text-gray-800 ',
		light: 'text-gray-700 ',
		dark: 'text-gray-700 ',
		default: 'text-gray-500 ',
		dropdown: 'text-gray-700 ',
		navbar: 'text-gray-700 ',
		navbarUl: 'text-gray-700 ',
		form: 'text-gray-900 ',
		primary: 'text-primary-800 dark:text-primary-400',
		none: ''
	};
	const borderColors = {
		gray: 'border-black/10 dark:border-gray-800 divide-gray-300 dark:divide-gray-800',
		light: 'border-gray-500 divide-gray-500',
		dark: 'border-gray-500 divide-gray-500',
		default: 'border-black/10 dark:border-gray-700 divide-gray-200 dark:divide-gray-700',
		dropdown: 'border-gray-100 dark:border-gray-600 divide-gray-100 dark:divide-gray-600',
		navbar: 'border-gray-100 dark:border-gray-700 divide-gray-100 dark:divide-gray-700',
		navbarUl: 'border-gray-100 dark:border-gray-700 divide-gray-100 dark:divide-gray-700',
		form: 'border-black/10 dark:border-gray-700 divide-gray-300 dark:divide-gray-700',
		primary: 'border-primary-500 dark:border-primary-200  divide-primary-500 dark:divide-primary-200 ',
		none: ''
	};
	let divClass;
	$: divClass = twMerge(bgColors[color], textColors[color], rounded && 'rounded-3xl', border && 'border', borderColors[color], shadow && 'shadow-md', $$props.class);
</script>

{#if transition && open}
	<svelte:element this={tag} transition:transition={params} use:use={options} bind:this={node} {role} {...$$restProps} class={divClass} on:click on:mouseenter on:mouseleave on:focusin on:focusout>
		<slot />
	</svelte:element>
{:else if open}
	<svelte:element this={tag} use:use={options} bind:this={node} {role} {...$$restProps} class={divClass} on:click on:mouseenter on:mouseleave on:focusin on:focusout>
		<slot />
	</svelte:element>
{/if}

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Props
@prop export let tag: string = $$restProps.href ? 'a' : 'div';
@prop export let color: FrameColor = 'default';
@prop export let rounded: boolean = false;
@prop export let border: boolean = false;
@prop export let shadow: boolean = false;
@prop export let node: HTMLElement | undefined = undefined;
@prop export let use: Action<HTMLElement, any> = noop;
@prop export let options = {};
@prop export let role: string | undefined = undefined;
@prop export let transition: TransitionFunc | undefined = undefined;
@prop export let params: object = {};
@prop export let open: boolean = true;
-->
