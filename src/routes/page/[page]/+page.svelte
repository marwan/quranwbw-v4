<script>
	export let data;

	$: page = +data.page;

	import Bismillah from '$display/Bismillah.svelte';
	import PageHead from '$misc/PageHead.svelte';
	import WordsBlock from '$display/verses/WordsBlock.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { goto } from '$app/navigation';
	import { __chapterNumber, __pageNumber, __currentPage, __wordType, __wordTranslation, __tajweedEnabled, __mushafPageDivisions } from '$utils/stores';
	import { updateSettings } from '$utils/updateSettings';
	import { apiEndpoint, errorLoadingDataMessage } from '$data/websiteSettings';
	import { quranMetaData, chapterHeaderCodes } from '$data/quranMeta';
	import { mushafFontLinks } from '$data/options';
	import { buttonClasses } from '$data/commonClasses';
	import { loadFont } from '$utils/loadFont';
	import '$lib/swiped-events.min.js';

	let pageData;
	let startingLine, endingLine;
	let chapters = [],
		verses = [],
		lines = [];

	// page:line for which we need to center the verse rathen than justify
	const centeredPageLines = ['528:9', '594:5', '602:5', '602:15', '603:10', '603:15', '604:4', '604:9', '604:14', '604:15'];

	// load some previous and next pages fonts for v4
	$: {
		if ($__wordType === 2) {
			for (let thisPage = +page - 1; thisPage <= +page + 1; thisPage++) {
				fetch(`${mushafFontLinks.COLRv1}/QCF4${`00${thisPage}`.slice(-3)}_COLOR-Regular.woff`);
			}
		}
	}

	$: {
		// empty all the arrays
		(chapters = []), (verses = []), (lines = []);

		pageData = (async () => {
			const apiURL = `${apiEndpoint}/page?page=${page}&word_type=${$__wordType}&word_translation=${$__wordTranslation}&v=92827326`;
			const response = await fetch(apiURL);
			const data = await response.json();
			const apiData = data.data.verses;
			localStorage.setItem('pageData', JSON.stringify(apiData));

			startingLine = apiData[Object.keys(apiData)[0]].words.line.split('|')[0];
			endingLine = apiData[Object.keys(apiData)[Object.keys(apiData).length - 1]].words.end_line;

			// get chapter numbers
			for (const [key, value] of Object.entries(apiData)) {
				const chapter = +key.split(':')[0];
				if (chapters.indexOf(chapter) === -1) {
					chapters.push(chapter);
				}
			}

			// get first verse of each chapters
			if (chapters.length > 0) {
				for (let chapter = 0; chapter <= chapters.length - 1; chapter++) {
					for (let verse = 1; verse <= quranMetaData[chapters[chapter]].verses; verse++) {
						if (apiData[`${chapters[chapter]}:${verse}`] !== undefined) {
							verses.push(verse);
							break;
						}
					}
				}
			}

			// get line numbers for chapters
			if (chapters.length > 0) {
				for (let chapter = 0; chapter <= chapters.length - 1; chapter++) {
					lines.push(+apiData[`${chapters[chapter]}:${verses[chapter]}`].words.line.split('|')[0]);
				}
			}

			// set the mushaf page divisions
			__mushafPageDivisions.set({
				chapters: chapters,
				juz: apiData[Object.keys(apiData)[0]].meta.juz
			});

			// goto previous page on left swipe
			document.getElementById('page-block').addEventListener('swiped-left', function (e) {
				goto(`/page/${page === 1 ? 1 : page - 1}`, { replaceState: false });
			});

			// goto next page on right swipe
			document.getElementById('page-block').addEventListener('swiped-right', function (e) {
				goto(`/page/${page === 604 ? 604 : page + 1}`, { replaceState: false });
			});

			return apiData;
		})();

		// set the page number
		__pageNumber.set(page);
	}

	// only allow continious normal mode, but skip saving the settings
	updateSettings({ type: 'displayType', value: 4, skipSave: true });

	// dynamically load header font
	loadFont('chapter-header', mushafFontLinks.header).then(() => {
		document.getElementById('header').classList.remove('invisible');
	});

	__currentPage.set('page');
</script>

<PageHead title={`Page ${page}`} />

<div id="page-block" class="text-center text-xl mt-6 overflow-x-hidden">
	{#await pageData}
		<Spinner height="screen" margin="-mt-20" />
	{:then}
		<div class="space-y-2 mt-1">
			<div class="max-w-3xl space-y-2 pb-2 mx-auto text-[5.4vw] md:text-[42px] lg:text-[36px]">
				{#each Array.from(Array(endingLine + 1).keys()).slice(startingLine) as line}
					<!-- if it's the first verse of a chapter -->
					{#if chapters.length > 0 && lines.includes(line) && verses[lines.indexOf(line)] === 1}
						<div class="flex flex-col my-2">
							<div id="header" style="font-family: chapter-header" class="leading-base pt-4 md:pt-8 pb-6 text-[28vw] md:text-[220px] lg:text-[230px]">{chapterHeaderCodes[chapters[lines.indexOf(line)]]}</div>

							<Bismillah {chapters} {lines} {line} />
						</div>
					{/if}

					<div class="line {line} flex px-2 arabic-font-{$__wordType} {+page < 3 || centeredPageLines.includes(`${+page}:${line}`) ? 'justify-center' : null} {+page > 2 && !centeredPageLines.includes(`${+page}:${line}`) ? 'justify-between' : null}">
						{#each Object.entries(JSON.parse(localStorage.getItem('pageData'))) as [key, value]}
							<WordsBlock {key} {value} {line} />
						{/each}
					</div>
				{/each}
			</div>

			<!-- page number -->
			<div class="max-w-3xl mx-auto justify-center text-sm">
				<div class="flex items-center">
					<div class="flex-1 border-t-2 border-gray-200"></div>
					<span class="px-3">{page}</span>
					<div class="flex-1 border-t-2 border-gray-200"></div>
				</div>
			</div>

			<!-- page navigator -->
			<div id="page-navigator" class="flex flex-row justify-center space-x-8 pt-6 text-sm">
				<!-- next page -->
				{#if page < 604}
					<a href="/page/{+page + 1}" class={buttonClasses}>{@html '&#x2190;'} Page {+page + 1}</a>
				{/if}

				<!-- previous page -->
				{#if page > 1}
					<a href="/page/{+page - 1}" class={buttonClasses}>Page {+page - 1} {@html '&#x2192;'}</a>
				{/if}
			</div>
		</div>
	{:catch error}
		<p>{errorLoadingDataMessage}</p>
	{/await}
</div>
