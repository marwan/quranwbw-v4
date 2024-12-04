<script>
	import Radio from '$ui/FlowbiteSvelte/forms/Radio.svelte';
	import Check from '$svgs/Check.svelte';
	import { __playButtonsFunctionality } from '$utils/stores';
	import { selectableVersePlayButtonOptions } from '$data/options';
	import { updateSettings } from '$utils/updateSettings';
	import { selectedRadioClasses } from '$data/commonClasses';
</script>

<div class="grid gap-3 w-full">
	{#each Object.entries(selectableVersePlayButtonOptions) as [id, options]}
		<Radio name="wordTooltip" bind:group={$__playButtonsFunctionality.verse} value={options.id} on:change={(event) => updateSettings({ type: 'versePlayButton', value: +event.target.value })} custom>
			<div class="inline-flex justify-between items-center p-5 w-full text-grayyy-500 {window.theme('background')} rounded-lg border {window.theme('border')} cursor-pointer {window.theme('checked')} hover:text-grayyy-600 hover:bg-grayyy-100 {$__playButtonsFunctionality.verse === options.id && selectedRadioClasses}">
				<div class="w-full">{options.name}</div>

				{#if $__playButtonsFunctionality.verse === options.id}
					<Check size={5} />
				{/if}
			</div>
		</Radio>
	{/each}
</div>
