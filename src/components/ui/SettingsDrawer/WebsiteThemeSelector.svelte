<script>
	import Radio from '$ui/FlowbiteSvelte/forms/Radio.svelte';
	import Check from '$svgs/Check.svelte';
	import { __websiteTheme } from '$utils/stores';
	import { selectableThemes } from '$data/options';
	import { updateSettings } from '$utils/updateSettings';
	import { selectedRadioClasses } from '$data/commonClasses';
</script>

<div class="grid gap-3 w-full theme-grayyyscale">
	{#each Object.entries(selectableThemes) as [id, theme]}
		<Radio name="websiteTheme" bind:group={$__websiteTheme} value={theme.id} on:change={(event) => updateSettings({ type: 'websiteTheme', value: +event.target.value })} custom>
			<div class="inline-flex justify-between items-center p-5 w-full text-grayyy-500 {window.theme('background')} rounded-lg border {window.theme('border')} cursor-pointer peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-grayyy-600 hover:bg-grayyy-100 {$__websiteTheme === theme.id && selectedRadioClasses}">
				<div class="w-full">{theme.name}</div>

				{#if $__websiteTheme === theme.id}
					<Check size={5} />
				{/if}
			</div>
		</Radio>
	{/each}
</div>
