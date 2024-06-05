<script>import Button from '../buttons/Button.svelte';
import { twMerge } from 'tailwind-merge';
export let group = [];
export let value = 'on';
export let checked = undefined;
export let inline = true;
// Button properties forwarding
export let pill = false;
export let outline = false;
export let size = undefined;
export let color = undefined;
export let shadow = false;
// react on external group changes
function init(_, _group) {
    if (checked === undefined)
        checked = _group.includes(value);
    onChange();
    return {
        update(_group) {
            checked = _group.includes(value);
        }
    };
}
function onChange() {
    // There's a bug in Svelte and bind:group is not working with wrapped checkbox
    // This workaround is taken from:
    // https://svelte.dev/repl/de117399559f4e7e9e14e2fc9ab243cc?version=3.12.1
    const index = group.indexOf(value);
    if (checked === undefined)
        checked = index >= 0;
    if (checked) {
        if (index < 0) {
            group.push(value);
            group = group;
        }
    }
    else {
        if (index >= 0) {
            group.splice(index, 1);
            group = group;
        }
    }
}
let buttonClass;
$: buttonClass = twMerge(inline ? 'inline-flex' : 'flex', $$props.class);
</script>

<Button tag="label" {checked} {pill} {outline} {size} {color} {shadow} class={buttonClass}>
  <input
    use:init={group}
    type="checkbox"
    bind:checked
    {value}
    {...$$restProps}
    class="sr-only"
    on:keyup
    on:keydown
    on:keypress
    on:focus
    on:blur
    on:click
    on:mouseover
    on:mouseenter
    on:mouseleave
    on:paste
    on:change={onChange}
    on:change />
  <slot />
</Button>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Props
@prop export let group: (string | number)[] = [];
@prop export let value: string | number = 'on';
@prop export let checked: boolean | undefined = undefined;
@prop export let inline: boolean = true;
@prop export let pill: boolean = false;
@prop export let outline: boolean = false;
@prop export let size: SizeType | undefined = undefined;
@prop export let color: ButtonColorType | undefined = undefined;
@prop export let shadow: boolean = false;
-->
