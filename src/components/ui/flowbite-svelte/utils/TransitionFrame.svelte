<script>import {} from 'svelte';
import { fade } from 'svelte/transition';
import Frame from './Frame.svelte';
// Export a prop through which you can set a desired svelte transition
export let transition = fade;
// Pass in extra transition params
export let params = {};
export let open = true;
function close(ev) {
    if (ev?.stopPropagation)
        ev.stopPropagation();
    open = false;
}
</script>

<Frame bind:open {transition} {params} {...$$restProps} on:show><slot {close} /></Frame>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Props
@prop export let transition: TransitionFunc = fade;
@prop export let params: object = {};
@prop export let open: boolean = true;
-->
