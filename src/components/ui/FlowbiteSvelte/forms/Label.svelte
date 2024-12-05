<script>
	import { twMerge } from 'tailwind-merge';
	export let color = 'grayyy';
	export let defaultClass = 'text-sm rtl:text-right font-medium block';
	export let show = true;
	let node;
	const colorClasses = {
		grayyy: 'text-grayyy-900',
		green: 'text-green-700',
		red: 'text-red-700',
		disabled: 'text-grayyy-400'
	};
	// function checkDisabled(node: HTMLLabelElement) {
	$: {
		const control = node?.control;
		color = control?.disabled ? 'disabled' : color;
	}
	$: labelClass = twMerge(defaultClass, colorClasses[color], $$props.class);
</script>

{#if show}
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label bind:this={node} {...$$restProps} class={labelClass}><slot /></label>
{:else}
	<slot />
{/if}

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Props
@prop export let color: 'grayyy' | 'green' | 'red' | 'disabled' = 'grayyy';
@prop export let defaultClass: string = 'text-sm rtl:text-right font-medium block';
@prop export let show: boolean = true;
-->
