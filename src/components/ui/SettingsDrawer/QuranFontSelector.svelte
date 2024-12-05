<script>
	import Radio from '$ui/FlowbiteSvelte/forms/Radio.svelte';
	import Check from '$svgs/Check.svelte';
	import { __currentPage, __fontType, __displayType, __chapterData, __chapterNumber } from '$utils/stores';
	import { selectableFontTypes } from '$data/options';
	import { updateSettings } from '$utils/updateSettings';
	import { selectedRadioClasses } from '$data/commonClasses';
</script>

<div class="grid gap-3 w-full">
	{#each Object.entries(selectableFontTypes) as [id, font]}
		{#if !font.disallowedIn.includes($__currentPage)}
			<Radio name="fontType" bind:group={$__fontType} value={font.id} on:change={(event) => updateSettings({ type: 'fontType', value: +event.target.value })} custom>
				<div class="inline-flex justify-between items-center p-5 w-full {window.theme('bgMain')} rounded-lg border {window.theme('border')} cursor-pointer {window.theme('checked')} {window.theme('hover')} {$__fontType === font.id && selectedRadioClasses}">
					<div class="w-full">{font.font}</div>

					{#if $__fontType === font.id}
						<Check size={5} />
					{/if}
				</div>
			</Radio>
		{/if}
	{/each}
</div>
