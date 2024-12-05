<script>
	import { twMerge } from 'tailwind-merge';
	import { getContext } from 'svelte';
	const group = getContext('group');
	export let pill = false;
	export let outline = false;
	export let size = group ? 'sm' : 'md';
	export let href = undefined;
	export let type = 'button';
	export let color = group ? (outline ? 'dark' : 'alternative') : 'primary';
	export let shadow = false;
	export let tag = 'button';
	export let checked = undefined;
	// export let disabled: boolean = false;
	const colorClasses = {
		alternative: `text-grayyy-900 ${window.theme('bgMain')} border ${window.theme('border')} ${window.theme('hover')} dark:bg-grayyy-800 dark:text-grayyy-400 hover:text-primary-700 focus-within:text-primary-700`,
		primary: 'bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700',
		none: ''
	};
	const colorCheckedClasses = {
		alternative: `text-primary-700 border dark:text-primary-500 bg-grayyy-100 dark:bg-grayyy-700 ${window.theme('border')} shadow-grayyy-300 dark:shadow-grayyy-800 shadow-inner`,
		primary: 'text-primary-900 bg-primary-400 dark:bg-primary-500 shadow-primary-700 dark:shadow-primary-800 shadow-inner',
		none: ''
	};
	const coloredFocusClasses = {
		alternative: 'focus-within:ring-grayyy-200 dark:focus-within:ring-grayyy-700',
		primary: 'focus-within:ring-grayyy-300 dark:focus-within:ring-grayyy-800',
		none: ''
	};
	const coloredShadowClasses = {
		alternative: 'shadow-grayyy-500/50 dark:shadow-grayyy-800/80',
		primary: 'shadow-primary-500/50 dark:shadow-primary-800/80',
		none: ''
	};
	const outlineClasses = {
		alternative: `text-grayyy-900 dark:text-grayyy-400 hover:border ${window.theme('border')} hover:bg-grayyy-900 focus-within:bg-grayyy-900 focus-within:focus-within:ring-grayyy-300`,
		primary: 'text-primary-700 hover:border border-primary-700 hover:bg-primary-700 dark:border-primary-500 dark:text-primary-500 dark:hover:dark:hover:bg-primary-600',
		none: ''
	};
	const sizeClasses = {
		xs: 'px-3 py-2 text-xs',
		sm: 'px-4 py-2 text-sm',
		md: 'px-5 py-2.5 text-sm',
		lg: 'px-5 py-3 text-base',
		xl: 'px-6 py-3.5 text-base'
	};
	const hasBorder = () => outline || color === 'alternative' || color === 'light';
	let buttonClass;
	$: buttonClass = twMerge(
		'text-center font-medium',
		group ? 'focus-within:ring-2' : 'focus-within:ring-4',
		group && 'focus-within:z-10',
		group || 'focus-within:outline-none',
		'inline-flex items-center justify-center ' + sizeClasses[size],
		outline && checked && `border dark:${window.theme('border')}`,
		outline && checked && colorCheckedClasses[color],
		outline && !checked && outlineClasses[color],
		!outline && checked && colorCheckedClasses[color],
		!outline && !checked && colorClasses[color],
		color === 'alternative' && (group && !checked ? `` : ``),
		outline && color === 'dark' && (group ? (checked ? `bg-grayyy-900 ${window.theme('border')} dark:border-white dark:bg-grayyy-600` : `dark:${window.theme('border')} dark:border-white`) : `dark:text-grayyy-400 dark:${window.theme('border')}`),
		coloredFocusClasses[color],
		hasBorder() && group && 'border-s-0 first:border-s',
		group ? (pill && 'first:rounded-s-full last:rounded-e-full') || 'first:rounded-s-lg last:rounded-e-lg' : (pill && 'rounded-full') || 'rounded-lg',
		shadow && 'shadow-lg',
		shadow && coloredShadowClasses[color],
		$$restProps.disabled && 'cursor-not-allowed opacity-50',
		$$props.class
	);
</script>

{#if href && !$$restProps.disabled}
	<a {href} {...$$restProps} class={buttonClass} role="button" on:click on:change on:keydown on:keyup on:touchstart|passive on:touchend on:touchcancel on:mouseenter on:mouseleave>
		<slot />
	</a>
{:else if tag === 'button' && !$$restProps.disabled}
	<button {type} {...$$restProps} class={buttonClass} on:click on:change on:keydown on:keyup on:touchstart|passive on:touchend on:touchcancel on:mouseenter on:mouseleave>
		<slot />
	</button>
{:else}
	<svelte:element this={tag} class={buttonClass}>
		<slot />
	</svelte:element>
{/if}

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Props
@prop export let pill: boolean = false;
@prop export let outline: boolean = false;
@prop export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = group ? 'sm' : 'md';
@prop export let href: string | undefined = undefined;
@prop export let type: HTMLButtonAttributes['type'] = 'button';
@prop export let color: ButtonColor = group ? (outline ? 'dark' : 'alternative') : 'primary';
@prop export let shadow: boolean = false;
@prop export let tag: string = 'button';
@prop export let checked: boolean | undefined = undefined;
@prop export let disabled: boolean = false;
-->
