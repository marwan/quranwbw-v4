<script>
	import Radio from '$ui/FlowbiteSvelte/forms/Radio.svelte';
	import Check from '$svgs/Check.svelte';
	import { __playButtonsFunctionality } from '$utils/stores';
	import { selectableVersePlayButtonOptions } from '$data/options';
	import { updateSettings } from '$utils/updateSettings';
	import { selectedRadioClasses } from '$data/commonClasses';
</script>

<div class="grid gap-3 w-full theme-grayscale">
	{#each Object.entries(selectableVersePlayButtonOptions) as [id, options]}
		<Radio name="wordTooltip" bind:group={$__playButtonsFunctionality.verse} value={options.id} on:change={(event) => updateSettings({ type: 'versePlayButton', value: +event.target.value })} custom>
			<div class="inline-flex justify-between items-center p-5 w-full text-gray-500 bg-white rounded-lg border border-gray-200 cursor-pointer peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-gray-600 hover:bg-gray-100 {$__playButtonsFunctionality.verse === options.id && selectedRadioClasses}">
				<div class="w-full">{options.name}</div>

				{#if $__playButtonsFunctionality.verse === options.id}
					<Check size={5} />
				{/if}
			</div>
		</Radio>
	{/each}
</div>
