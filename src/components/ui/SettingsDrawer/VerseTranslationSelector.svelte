<script>
	import Checkbox from '$ui/flowbite-svelte/forms/Checkbox.svelte';
	import { __verseTranslations } from '$utils/stores';
	import { selectableVerseTranslations, verseTranslationsLanguages } from '$data/options';
	import { updateSettings } from '$utils/updateSettings';

	const radioClasses = 'font-normal';
</script>

<div class="flex flex-col space-y-4 pt-2">
	{#each Object.entries(verseTranslationsLanguages) as [id, language]}
		<div class="flex flex-col space-y-2">
			<div id="translation-name" class="text-sm font-medium">{language.language}</div>
			<div id="translation-list" class="space-y-2">
				{#each Object.values(selectableVerseTranslations) as translation}
					{#if translation.language_id === language.language_id}
						<div class="flex items-center">
							<!-- using else-if block to add the "checked" attribute because for some reason the inline check is not working in Svelte as compared to regular javascript -->
							{#if $__verseTranslations.includes(translation.resource_id)}
								<Checkbox checked id="verseTranslationCheckbox-{translation.resource_id}" on:click={() => updateSettings({ type: 'verseTranslation', value: translation.resource_id })} class={radioClasses}>{translation.resource_name}</Checkbox>
							{:else}
								<Checkbox id="verseTranslationCheckbox-{translation.resource_id}" on:click={() => updateSettings({ type: 'verseTranslation', value: translation.resource_id })} class={radioClasses}>{translation.resource_name}</Checkbox>
							{/if}
						</div>
					{/if}
				{/each}
			</div>
		</div>
	{/each}
</div>
