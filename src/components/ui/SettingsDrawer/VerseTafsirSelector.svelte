<script>
	import Radio from '$ui/flowbite-svelte/forms/Radio.svelte';
	import Check from '$svgs/Check.svelte';
	import { __verseTafsir } from '$utils/stores';
	import { verseTafsirLanguages, selectableTafsirs } from '$data/selectableTafsirs';
	import { updateSettings } from '$utils/updateSettings';
	import { selectedRadioClasses } from '$data/commonClasses';
</script>

<div class="grid gap-3 w-full theme-grayscale">
	{#each Object.entries(verseTafsirLanguages) as [id, language]}
		<div class="flex flex-col space-y-2 pb-6">
			<div id="translation-name" class="text-md font-medium">{language.language}</div>
			<div id="translation-list" class="space-y-3">
				{#each Object.entries(selectableTafsirs) as [id, tafsir]}
					{#if tafsir.language === language.language}
						<div class="flex items-center w-full">
							<Radio name="verseTafsir" bind:group={$__verseTafsir} value={tafsir.id} on:change={(event) => updateSettings({ type: 'verseTafsir', value: +event.target.value })} custom>
								<div class="inline-flex justify-between items-center p-5 w-full text-gray-500 bg-white rounded-lg border border-gray-200 cursor-pointer peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-gray-600 hover:bg-gray-100 {$__verseTafsir === tafsir.id && selectedRadioClasses}">
									<div class="flex flex-col space-y-2 w-full">
										<span>{tafsir.name}</span>
										<span class="text-xs font-normal">{tafsir.author}</span>
									</div>

									{#if $__verseTafsir === tafsir.id}
										<Check size={5} />
									{/if}
								</div>
							</Radio>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	{/each}
</div>
