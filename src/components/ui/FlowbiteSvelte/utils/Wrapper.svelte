<script>export let tag = 'div';
export let show;
export let use = () => { };
</script>

{#if show}
  <svelte:element this={tag} use:use {...$$restProps}><slot /></svelte:element>
{:else}
  <slot />
{/if}

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Props
@prop export let tag: string = 'div';
@prop export let show: boolean;
@prop export let use: Action<HTMLElement, any> = () => {};
-->
