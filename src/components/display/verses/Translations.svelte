<script>
	export let value;
	import { __userSettings, __verseTranslations } from '$utils/stores';
	import { selectableVerseTranslations } from '$data/options';
	const fontSizes = JSON.parse($__userSettings).displaySettings.fontSizes;
</script>

{#if value.translations != undefined}
	<div class="verseTranslationText flex flex-col space-y-4 leading-normal theme {fontSizes.verseTranslationText}" data-fontSize={fontSizes.verseTranslationText}>
		{#each Object.entries(value.translations) as [verseTranslationID, verseTranslation]}
			<div class="flex flex-col print:break-inside-avoid">
				<span class={selectableVerseTranslations[verseTranslationID].language === 'Urdu' ? 'font-Urdu direction-rtl' : 'direction-ltr'}>{@html verseTranslation}</span>
				{#if $__verseTranslations.length > 1}
					<span class="opacity-70">&mdash; {selectableVerseTranslations[verseTranslationID].author}</span>
				{/if}
			</div>
		{/each}
	</div>
{/if}
