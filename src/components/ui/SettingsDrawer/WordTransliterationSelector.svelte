<script>
	import Radio from '$ui/FlowbiteSvelte/forms/Radio.svelte';
	import Check from '$svgs/Check.svelte';
	import { __wordTransliteration } from '$utils/stores';
	import { selectableWordTransliterations } from '$data/options';
	import { updateSettings } from '$utils/updateSettings';
	import { selectedRadioClasses } from '$data/commonClasses';
</script>

<div class="grid gap-3 w-full">
	{#each Object.entries(selectableWordTransliterations) as [id, translation]}
		<Radio name="wordTranslation" bind:group={$__wordTransliteration} value={translation.id} on:change={(event) => updateSettings({ type: 'wordTransliteration', value: +event.target.value })} custom>
			<div class="inline-flex justify-between items-center p-5 w-full text-grayyy-500 {window.theme('background')} rounded-lg border {window.theme('border')} cursor-pointer peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-grayyy-600 hover:bg-grayyy-100 {$__wordTransliteration === translation.id && selectedRadioClasses}">
				<div class="w-full">{translation.language}</div>

				{#if $__wordTransliteration === translation.id}
					<Check size={5} />
				{/if}
			</div>
		</Radio>
	{/each}
</div>

<!-- <div class="text-xs opacityyy-70">
	Relying exclusively on transliteration is not the ideal method to recite the Quran, as it can lead to pronunciation errors. To fully appreciate and accurately convey the Quranic text, it is essential to learn to read the Quran in its original Arabic. This ensures the correct pronunciation and intonation, enabling one to receive the full reward and blessings associated with recitation. By
	mastering the Arabic script, you not only deepen your understanding and connection with the sacred text but also preserve its divine essence and beauty.
</div> -->
