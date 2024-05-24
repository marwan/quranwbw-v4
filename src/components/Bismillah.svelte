<script>
	export let chapters = null,
		lines = null,
		line = null;

	import { __currentPage, __chapterNumber, __wordType, __tajweedEnabled } from '$utils/stores';
	import { mushafFontLinks } from '$data/options';
	import { loadFont } from '$utils/loadFont';

	const bismillahTypes = {
		uthmaniType1: 'ﲚﲛﲞﲤ',
		uthmaniType2: 'ﲪﲫﲮﲴ',
		indopakType: '﷽'
	};

	const bismillahFontClass = {
		1: 'bismillah text-xl md:text-2xl',
		2: 'bismillah text-xl md:text-2xl',
		3: 'arabic-font-3 text-2xl md:text-3xl'
	};

	// dynamically load bismillah fonts for uthmani fonts
	if ($__wordType === 1 || $__wordType === 2) {
		loadFont('bismillah', mushafFontLinks.bismillah).then(() => {
			// we can by default hide the bismillah and show when the font is loaded...
			// document.getElementById('bismillah-uthmani').classList.remove('invisible');

			document.querySelectorAll('.bismillah-uthmani').forEach((element) => {
				element.classList.remove('invisible');
			});
		});
	}
</script>

<!-- chapter page -->
{#if $__currentPage === 'chapter'}
	{#if ![1, 9].includes($__chapterNumber)}
		<div class="flex flex-col text-center flex-wrap block font-filter py-4 {$__tajweedEnabled ? 'theme-palette-tajweed' : 'theme-palette-normal'} {bismillahFontClass[$__wordType]}">
			{#if $__wordType === 1 || $__wordType === 2}
				<span style="font-family: bismillah;" class="invisible bismillah-uthmani">
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
	<div style="font-family: bismillah;" class="invisible bismillah-uthmani flex flex-col text-center leading-normal flex-wrap space-y-4 block md:mt-6 text-[5vw] md:text-[32px] lg:text-[36px] font-filter {$__tajweedEnabled ? 'theme-palette-tajweed' : 'theme-palette-normal'}">
		{#if chapters[lines.indexOf(line)] === 2}
			{bismillahTypes.uthmaniType1}
		{:else if ![1, 9, 2].includes(chapters[lines.indexOf(line)])}
			{bismillahTypes.uthmaniType2}
		{/if}
	</div>
{/if}
