<script>
	export let individualSettingsClasses;

	import Radio from '$ui/FlowbiteSvelte/forms/Radio.svelte';
	import Check from '$svgs/Check.svelte';
	import { __websiteTheme } from '$utils/stores';
	import { selectableThemes } from '$data/options';
	import { updateSettings } from '$utils/updateSettings';
	import { selectedRadioClasses, linkClasses } from '$data/commonClasses';
</script>

<div class="grid gap-3 w-full">
	{#each Object.entries(selectableThemes) as [id, theme]}
		<Radio name="websiteTheme" bind:group={$__websiteTheme} value={theme.id} on:change={(event) => updateSettings({ type: 'websiteTheme', value: +event.target.value })} custom>
			<div class="{individualSettingsClasses} {$__websiteTheme === theme.id && selectedRadioClasses}">
				<div class="w-full">{theme.name}</div>

				{#if $__websiteTheme === theme.id}
					<Check size={5} />
				{/if}
			</div>
		</Radio>
	{/each}
</div>

<div class="text-xs pt-6 opacity-70">Got a unique color combo in mind that's a visual delight? Shoot your suggestions over to <a class={linkClasses} href="mailto:quranwbw@gmail.com">quranwbw@gmail.com</a>.</div>
