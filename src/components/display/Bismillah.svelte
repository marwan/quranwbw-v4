<script>
	export let chapters = null;
	export let lines = null;
	export let line = null;

	import { __currentPage, __chapterNumber, __wordType, __tajweedEnabled } from '$utils/stores';

	const bismillahTypes = {
		uthmaniType1: 'ﲚﲛﲞﲤ',
		uthmaniType2: 'ﲪﲫﲮﲴ',
		indopakType: '﷽'
	};
</script>

<!-- chapter page -->
{#if $__currentPage === 'chapter'}
	{#if ![1, 9].includes($__chapterNumber)}
		<div class="flex flex-col text-center flex-wrap block pt-6 pb-4 text-2xl md:text-3xl {$__wordType === 3 ? 'arabic-font-3' : 'bismillah'}">
			{#if $__wordType === 1 || $__wordType === 2}
				<span class="font-filter {$__wordType === 1 ? 'theme-palette-normal' : $__tajweedEnabled ? 'theme-palette-tajweed' : 'theme-palette-normal'}">
					{#if $__chapterNumber === 2}
						{bismillahTypes.uthmaniType1}
					{:else if ![1, 9, 2].includes($__chapterNumber)}
						{bismillahTypes.uthmaniType2}
					{/if}
				</span>
			{:else if $__wordType === 3}
				{bismillahTypes.indopakType}
			{/if}
		</div>
	{/if}

	<!-- mushaf page -->
{:else if $__currentPage === 'page'}
	<div class="flex flex-col text-center leading-normal flex-wrap space-y-4 block md:mt-6 text-[5vw] md:text-[32px] lg:text-[36px] font-filter {$__wordType === 2 && $__tajweedEnabled ? 'theme-palette-tajweed' : 'theme-palette-normal'}">
		{#if chapters[lines.indexOf(line)] === 2}
			{bismillahTypes.uthmaniType1}
		{:else if ![1, 9, 2].includes(chapters[lines.indexOf(line)])}
			{bismillahTypes.uthmaniType2}
		{/if}
	</div>
{/if}
