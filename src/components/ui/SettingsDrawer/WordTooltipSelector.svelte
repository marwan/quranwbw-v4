<script>
	import Radio from '$ui/FlowbiteSvelte/forms/Radio.svelte';
	import Check from '$svgs/Check.svelte';
	import { __wordTooltip } from '$utils/stores';
	import { selectableTooltipOptions } from '$data/options';
	import { updateSettings } from '$utils/updateSettings';
	import { selectedRadioClasses } from '$data/commonClasses';
</script>

<div class="grid gap-3 w-full">
	{#each Object.entries(selectableTooltipOptions) as [id, options]}
		<Radio name="wordTooltip" bind:group={$__wordTooltip} value={options.id} on:change={(event) => updateSettings({ type: 'wordTooltip', value: +event.target.value })} custom>
			<div class="inline-flex justify-between items-center p-5 w-full {window.theme('background')} rounded-lg border {window.theme('border')} cursor-pointer {window.theme('checked')} {window.theme('hover')} {$__wordTooltip === options.id && selectedRadioClasses}">
				<div class="w-full">{options.name}</div>

				{#if $__wordTooltip === options.id}
					<Check size={5} />
				{/if}
			</div>
		</Radio>
	{/each}
</div>
