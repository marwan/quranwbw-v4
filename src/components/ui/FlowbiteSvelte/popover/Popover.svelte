<script>
	import Popper from '../utils/Popper.svelte';
	export let title = '';
	export let defaultClass = 'py-2 px-3';
</script>

<Popper activeContent border shadow rounded {...$$restProps} class="dark:!${window.theme('border')} {$$props.class}" on:show>
	{#if $$slots.title || title}
		<div class="py-2 px-3 bg-grayyy-100 rounded-t-md border-b {window.theme('border')} dark:{window.theme('border')} dark:bg-grayyy-700">
			<slot name="title">
				<h3 class="font-semibold dark:text-white">{title}</h3>
			</slot>
		</div>
	{/if}
	<div class={defaultClass}>
		<slot />
	</div>
</Popper>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Props
@prop export let title: string = '';
@prop export let defaultClass: string = 'py-2 px-3';
-->
