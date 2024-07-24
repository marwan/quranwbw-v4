<script>
	import Radio from '$ui/flowbite-svelte/forms/Radio.svelte';
	import { __websiteTheme } from '$utils/stores';
	import { selectableThemes } from '$data/options';
	import { updateSettings } from '$utils/updateSettings';

	const selectedRadioClasses = 'bg-gray-200 border-gray-400';
</script>

<!-- {#each Object.entries(selectableThemes) as [id, theme]}
	<Radio name="websiteTheme" bind:group={$__websiteTheme} value={theme.id} on:change={(event) => updateSettings({ type: 'websiteTheme', value: +event.target.value })} class={radioClasses}>{theme.name}</Radio>
{/each} -->

<div class="grid gap-6 w-full theme-grayscale">
	{#each Object.entries(selectableThemes) as [id, theme]}
		<Radio name="websiteTheme" bind:group={$__websiteTheme} value={theme.id} on:change={(event) => updateSettings({ type: 'websiteTheme', value: +event.target.value })} custom>
			<div class="inline-flex justify-between items-center p-5 w-full text-gray-500 bg-white rounded-lg border border-gray-200 cursor-pointer peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-gray-600 hover:bg-gray-100 {$__websiteTheme === theme.id && selectedRadioClasses}">
				<div class="w-full">{theme.name}</div>
			</div>
		</Radio>
	{/each}
</div>
