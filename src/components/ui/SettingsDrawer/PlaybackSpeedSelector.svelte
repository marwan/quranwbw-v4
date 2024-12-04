<script>
	import Radio from '$ui/FlowbiteSvelte/forms/Radio.svelte';
	import Check from '$svgs/Check.svelte';
	import { __playbackSpeed } from '$utils/stores';
	import { selectablePlaybackSpeeds } from '$data/options';
	import { updateSettings } from '$utils/updateSettings';
	import { selectedRadioClasses } from '$data/commonClasses';
</script>

<div class="grid gap-3 w-full theme-grayyyscale">
	{#each Object.entries(selectablePlaybackSpeeds) as [id, speed]}
		<Radio name="playbackSpeed" bind:group={$__playbackSpeed} value={speed.id} on:change={(event) => updateSettings({ type: 'playbackSpeed', value: +event.target.value })} custom>
			<div class="inline-flex justify-between items-center p-5 w-full text-black text-grayyy-500 {window.theme('background')} rounded-lg border ${window.theme('border')} cursor-pointer peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-black text-grayyy-600 hover:bg-grayyy-100 {$__playbackSpeed === speed.id && selectedRadioClasses}">
				<div class="w-full">x{speed.speed}</div>

				{#if $__playbackSpeed === speed.id}
					<Check size={5} />
				{/if}
			</div>
		</Radio>
	{/each}
</div>
