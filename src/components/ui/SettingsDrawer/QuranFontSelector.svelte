<script>
	import Radio from '$ui/FlowbiteSvelte/forms/Radio.svelte';
	import Check from '$svgs/Check.svelte';
	import { __currentPage, __fontType, __displayType, __chapterData, __chapterNumber } from '$utils/stores';
	import { selectableFontTypes } from '$data/options';
	import { updateSettings } from '$utils/updateSettings';
	import { selectedRadioOrCheckboxClasses, individualRadioClasses } from '$data/commonClasses';
</script>

<div class="grid gap-3 w-full">
	{#each Object.entries(selectableFontTypes) as [id, font]}
		{#if !font.disallowedIn.includes($__currentPage)}
			<Radio name="fontType" bind:group={$__fontType} value={font.id} on:change={(event) => updateSettings({ type: 'fontType', value: +event.target.value })} custom>
				<div class="{individualRadioClasses} {$__fontType === font.id && selectedRadioOrCheckboxClasses}">
					<div class="w-full">{font.font}</div>

					{#if $__fontType === font.id}
						<Check size={5} />
					{/if}
				</div>
			</Radio>
		{/if}
	{/each}
</div>
