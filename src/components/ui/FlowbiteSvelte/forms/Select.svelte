<script>
	import { twMerge } from 'tailwind-merge';
	export let items = [];
	export let value = undefined;
	export let placeholder = 'Choose option ...';
	export let underline = false;
	export let size = 'md';
	export let defaultClass = `border ${window.theme('border')} rounded-lg ${window.theme('input')}`;
	export let underlineClass = `bg-transparent border-0 border-b-2 ${window.theme('border')} appearance-none ${window.theme('input')} peer`;
	const common = 'block w-full';
	const sizes = {
		sm: 'text-sm p-2',
		md: 'text-sm p-2.5',
		lg: 'text-base py-3 px-4'
	};
	let selectClass;
	$: selectClass = twMerge(common, underline ? underlineClass : defaultClass, sizes[size], underline && '!px-0', $$props.class);
</script>

<select {...$$restProps} bind:value class={selectClass} on:change on:contextmenu on:input>
	{#if placeholder}
		<option disabled selected value="">{placeholder}</option>
	{/if}

	{#each items as { value, name }}
		<option {value}>{name}</option>
	{:else}
		<slot />
	{/each}
</select>
