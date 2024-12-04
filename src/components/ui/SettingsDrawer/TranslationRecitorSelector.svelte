<script>
	import Radio from '$ui/FlowbiteSvelte/forms/Radio.svelte';
	import Check from '$svgs/Check.svelte';
	import { __translationReciter } from '$utils/stores';
	import { selectableTranslationReciters } from '$data/options';
	import { updateSettings } from '$utils/updateSettings';
	import { selectedRadioClasses } from '$data/commonClasses';
</script>

<div class="grid gap-3 w-full">
	{#each Object.entries(selectableTranslationReciters) as [id, reciter]}
		<Radio name="reciter" bind:group={$__translationReciter} value={reciter.id} on:change={(event) => updateSettings({ type: 'translationReciter', value: +event.target.value })} custom>
			<div class="inline-flex justify-between items-center p-5 w-full text-grayyy-500 {window.theme('background')} rounded-lg border {window.theme('border')} cursor-pointer {window.theme('checked')} {window.theme('hover')} {$__translationReciter === reciter.id && selectedRadioClasses}">
				<div class="w-full">{reciter.reciter}</div>

				{#if $__translationReciter === reciter.id}
					<Check size={5} />
				{/if}
			</div>
		</Radio>
	{/each}
</div>
