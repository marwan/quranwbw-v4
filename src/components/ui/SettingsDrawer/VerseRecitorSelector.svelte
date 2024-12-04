<script>
	import Radio from '$ui/FlowbiteSvelte/forms/Radio.svelte';
	import Check from '$svgs/Check.svelte';
	import { __reciter, __websiteTheme } from '$utils/stores';
	import { selectableReciters } from '$data/options';
	import { updateSettings } from '$utils/updateSettings';
	import { selectedRadioClasses } from '$data/commonClasses';
	import { staticEndpoint } from '$data/websiteSettings';

	$: reciterImageClasses = `rounded-full size-10 grayscale ${[2, 3, 4].includes($__websiteTheme) && 'invert'}`;
</script>

<div class="grid gap-3 w-full theme-grayyyscale">
	{#each Object.entries(selectableReciters) as [id, reciter]}
		<Radio name="reciter" bind:group={$__reciter} value={reciter.id} on:change={(event) => updateSettings({ type: 'reciter', value: +event.target.value })} custom>
			<div class="inline-flex justify-between items-center px-5 py-3 w-full text-grayyy-500 {window.theme('background')} rounded-lg border {window.theme('border')} cursor-pointer peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-grayyy-600 hover:bg-grayyy-100 {$__reciter === reciter.id && selectedRadioClasses}">
				<div class="flex flex-row space-x-2 items-center w-full">
					<img src="{staticEndpoint}/v4/images/reciters/{reciter.image}" class={reciterImageClasses} alt={reciter.reciter} />
					<span>{reciter.reciter}</span>
				</div>

				{#if $__reciter === reciter.id}
					<Check size={5} />
				{/if}
			</div>
		</Radio>
	{/each}
</div>
