<script>
	export let chapters = null;
	export let lines = null;
	export let line = null;
	export let startVerse = null;

	import { __currentPage, __chapterNumber, __wordType } from '$utils/stores';

	const bismillahTypes = {
		uthmaniType1: 'ﲚﲛﲞﲤ',
		uthmaniType2: 'ﲪﲫﲮﲴ',
		indopakType: '﷽'
	};

	const chapterBismillahClasses = `
		flex flex-col text-center flex-wrap block pt-6 pb-4 
		${[1, 2, 3].includes($__wordType) ? `bismillah ${$__chapterNumber === 2 ? 'text-3xl' : 'text-2xl md:text-3xl'}` : 'arabic-font-4 text-3xl md:text-4xl theme'}
	`;

	const mushafBismillahClasses = `
		bismillah flex flex-col text-center leading-normal flex-wrap space-y-4 block md:mt-6 text-[5vw] md:text-[32px] lg:text-[36px] 
		${$__wordType === 3 ? 'theme-palette-tajweed' : 'theme-palette-normal'}
	`;
</script>

<!-- chapter page -->
{#if $__currentPage === 'chapter'}
	{#if ![1, 9].includes($__chapterNumber) || ($__chapterNumber === 1 && startVerse > 1)}
		<div class={chapterBismillahClasses}>
			<!-- uthmani font -->
			{#if [1, 2, 3].includes($__wordType)}
				<span class={$__wordType === 1 ? 'theme-palette-normal' : $__wordType === 3 ? 'theme-palette-tajweed' : 'theme-palette-normal'}>
					{#if $__chapterNumber === 2}
						{bismillahTypes.uthmaniType1}
					{:else if ![1, 9, 2].includes($__chapterNumber) || ($__chapterNumber === 1 && startVerse > 1)}
						{bismillahTypes.uthmaniType2}
					{/if}
				</span>

				<!-- indopak font -->
			{:else if $__wordType === 4}
				{bismillahTypes.indopakType}
			{/if}
		</div>
	{/if}

	<!-- mushaf page -->
{:else if $__currentPage === 'page'}
	<div class={mushafBismillahClasses}>
		{#if chapters[lines.indexOf(line)] === 2}
			{bismillahTypes.uthmaniType1}
		{:else if ![1, 9, 2].includes(chapters[lines.indexOf(line)])}
			{bismillahTypes.uthmaniType2}
		{/if}
	</div>
{/if}
