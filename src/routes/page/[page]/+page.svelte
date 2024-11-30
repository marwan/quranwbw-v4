<script>
	export let data;

	import Bismillah from '$display/Bismillah.svelte';
	import PageHead from '$misc/PageHead.svelte';
	import WordsBlock from '$display/verses/WordsBlock.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import Minimize from '$svgs/Minimize.svelte';
	// import BottomToolbarButtons from '$ui/BottomToolbar/BottomToolbarButtons.svelte';
	import Tooltip from '$ui/FlowbiteSvelte/tooltip/Tooltip.svelte';
	import { goto } from '$app/navigation';
	import { __chapterNumber, __pageNumber, __currentPage, __fontType, __wordTranslation, __mushafPageDivisions, __lastRead, __displayType, __topNavbarVisible, __bottomToolbarVisible, __mushafMinimalModeEnabled } from '$utils/stores';
	import { updateSettings } from '$utils/updateSettings';
	import { apiEndpoint, apiVersion, errorLoadingDataMessage, mushafWordFontLink, mushafHeaderFontLink, mushafFontVersion } from '$data/websiteSettings';
	import { quranMetaData, chapterHeaderCodes } from '$data/quranMeta';
	import { selectableFontTypes } from '$data/options';
	import { loadFont } from '$utils/loadFont';
	import { toggleMushafMinimalMode } from '$utils/toggleMushafMinimalMode';
	import { splitDelimeter } from '$data/websiteSettings';
	import '$lib/swiped-events.min.js';

	// Lines to be centered instead of justified
	const centeredPageLines = ['528:9', '594:5', '602:5', '602:15', '603:10', '603:15', '604:4', '604:9', '604:14', '604:15'];

	let pageData;
	let startingLine;
	let endingLine;
	let chapters = [];
	let verses = [];
	let lines = [];

	// Set the page number
	$: page = +data.page;

	// Prefetch adjacent pages for better UX
	$: {
		if ([2, 3].includes($__fontType)) {
			for (let thisPage = +page - 2; thisPage <= +page + 2; thisPage++) {
				fetch(`${mushafWordFontLink}/QCF4${`00${thisPage}`.slice(-3)}_COLOR-Regular.woff?version=${mushafFontVersion}`);
				fetch(`${apiEndpoint}/page?page=${thisPage}&word_type=${selectableFontTypes[$__fontType].apiId}&word_translation=${$__wordTranslation}&version=${apiVersion}`);
			}
		}
	}

	// Fetching the page data from API
	$: {
		chapters = [];
		verses = [];
		lines = [];

		pageData = (async () => {
			const apiURL = `${apiEndpoint}/page?page=${page}&word_type=${selectableFontTypes[$__fontType].apiId}&word_translation=${$__wordTranslation}&version=${apiVersion}`;
			const response = await fetch(apiURL);
			const data = await response.json();
			const apiData = data.data.verses;
			localStorage.setItem('pageData', JSON.stringify(apiData));

			startingLine = apiData[Object.keys(apiData)[0]].words.line.split(splitDelimeter)[0];
			endingLine = apiData[Object.keys(apiData)[Object.keys(apiData).length - 1]].words.end_line;

			// Get chapter numbers
			for (const key of Object.keys(apiData)) {
				const chapter = +key.split(':')[0];
				if (!chapters.includes(chapter)) {
					chapters.push(chapter);
				}
			}

			// Get the first verse of each chapter
			chapters.forEach((chapter) => {
				for (let verse = 1; verse <= quranMetaData[chapter].verses; verse++) {
					if (apiData[`${chapter}:${verse}`]) {
						verses.push(verse);
						break;
					}
				}
			});

			// Get line numbers for chapters
			chapters.forEach((chapter, index) => {
				lines.push(+apiData[`${chapter}:${verses[index]}`].words.line.split(splitDelimeter)[0]);
			});

			// Set the mushaf page divisions
			__mushafPageDivisions.set({
				chapters: chapters,
				juz: apiData[Object.keys(apiData)[0]].meta.juz
			});

			// Event listeners for swipe gestures
			const pageBlock = document.getElementById('page-block');
			pageBlock.addEventListener('swiped-left', () => goto(`/page/${page === 1 ? 1 : page - 1}`, { replaceState: false }));
			pageBlock.addEventListener('swiped-right', () => goto(`/page/${page === 604 ? 604 : page + 1}`, { replaceState: false }));

			// Dynamically load header font
			loadFont('chapter-headers', `${mushafHeaderFontLink}?version=${mushafFontVersion}`).then(() => {
				document.querySelectorAll('.header').forEach((element) => element.classList.remove('invisible'));
			});

			return apiData;
		})();

		// Update the page number and last read page
		__pageNumber.set(page);
		const key = JSON.parse(localStorage.getItem('userSettings')).lastRead.key;
		updateSettings({ type: 'lastRead', value: { key: key !== undefined ? key : '1:1', page } });
	}

	// Only allow continuous normal mode, without saving the setting
	$__displayType = 4;

	// Set the current page to 'mushaf'
	__currentPage.set('mushaf');
</script>

<PageHead title={`Page ${page}`} />

<div id="page-block" class="text-center text-xl mt-6 mb-14 overflow-x-hidden overflow-y-hidden">
	{#await pageData}
		<Spinner height="screen" margin="-mt-20" />
	{:then}
		<div class="space-y-2 mt-2.5">
			<div class="max-w-3xl md:max-w-[40rem] pb-2 mx-auto text-[5.4vw] md:text-[36px] lg:text-[36px] {+page === 1 ? 'space-y-1' : 'space-y-2'}">
				{#each Array.from(Array(endingLine + 1).keys()).slice(startingLine) as line}
					<!-- if it's the first verse of a chapter -->
					{#if chapters.length > 0 && lines.includes(line) && verses[lines.indexOf(line)] === 1}
						<div class="flex flex-col my-2">
							<div style="font-family: chapter-headers" class="header invisible leading-base pt-4 md:pt-8 pb-6 text-[28vw] md:text-[195px] lg:text-[195px]">{chapterHeaderCodes[chapters[lines.indexOf(line)]]}</div>

							<Bismillah {chapters} {lines} {line} />
						</div>
					{/if}

					<div class="line {line} flex px-2 arabic-font-{$__fontType} {+page < 3 || centeredPageLines.includes(`${+page}:${line}`) ? 'justify-center' : null} {+page > 2 && !centeredPageLines.includes(`${+page}:${line}`) ? 'justify-between' : null}">
						{#each Object.entries(JSON.parse(localStorage.getItem('pageData'))) as [key, value]}
							<WordsBlock {key} {value} {line} />
						{/each}
					</div>
				{/each}
			</div>

			<!-- page number -->
			<div class="max-w-3xl md:max-w-[40rem] mx-auto justify-center text-sm theme">
				<div class="flex items-center">
					<div class="flex-1 border-t-2 border-black/10"></div>
					<span class="px-3 opacity-70">{page}</span>
					<div class="flex-1 border-t-2 border-black/10"></div>
				</div>
			</div>
		</div>
	{:catch error}
		<p>{errorLoadingDataMessage}</p>
	{/await}
</div>

<!-- only show the minimize minimal mode button when it is enabled -->
{#if $__mushafMinimalModeEnabled}
	<!-- <div class="flex flex-row justify-between mx-auto max-w-3xl md:max-w-[40rem] -mt-12 pb-12 scale-[0.80]">
		<BottomToolbarButtons />
	</div> -->

	<div class="flex justify-center -mt-12 pb-16">
		<button class="w-fit flex flex-row space-x-2 py-3 px-3 text-black/70 opacity-70 bg-gray-200 hover:bg-gray-300 rounded-xl items-center cursor-pointer theme" on:click={toggleMushafMinimalMode}>
			<Minimize size={3} />
		</button>
		<Tooltip arrow={false} type="light" class="z-30 hidden md:block font-filter font-normal">Minimal Mode</Tooltip>
	</div>
{/if}
