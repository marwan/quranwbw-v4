<script>import Frame from '../utils/Frame.svelte';
import { setContext } from 'svelte';
import { writable } from 'svelte/store';
import { twJoin, twMerge } from 'tailwind-merge';
export let embedded = false;
const separators = writable(false);
setContext('toolbar', separators);
let color;
$: color = embedded ? 'none' : $$props.color;
let separatorsClass;
$: separatorsClass = twJoin($separators && 'sm:divide-x rtl:divide-x-reverse');
let divClass;
$: divClass = twMerge('flex justify-between items-center', !embedded && 'py-2 px-3', $$props.class);
</script>

<Frame {...$$restProps} class={divClass} {color} rounded={!embedded}>
  <Frame class="flex flex-wrap items-center {separatorsClass}" {color} rounded={!embedded}>
    <slot />
  </Frame>
  <slot name="end" />
</Frame>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Props
@prop export let embedded: boolean = false;
-->
