<script>
	export let page;

	import Bismillah from '$display/Bismillah.svelte';
	import WordsBlock from '$display/verses/WordsBlock.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { __chapterNumber, __pageNumber, __currentPage, __fontType, __wordTranslation, __mushafPageDivisions, __lastRead, __displayType } from '$utils/stores';
	import { updateSettings } from '$utils/updateSettings';
	import { apiEndpoint, errorLoadingDataMessage } from '$data/websiteSettings';
	import { quranMetaData, chapterHeaderCodes } from '$data/quranMeta';
	import { mushafFontLinks, selectableFontTypes } from '$data/options';
	import { loadFont } from '$utils/loadFont';
	import { inview } from 'svelte-inview';
	import { buttonOutlineClasses } from '$data/commonClasses';

	$: page = +page;

	let pageData;
	let startingLine, endingLine;
	let chapters = [];
	let verses = [];
	let lines = [];
	let SinglePageComponent;
	let nextPageToLoad;
	const options = {
		rootMargin: '-50%'
	};
	// const loadButtonOptions = {
	// 	rootMargin: '100px',
	// 	unobserveOnEnter: true
	// };

	// page:line for which we need to center the verse rathen than justify
	const centeredPageLines = ['528:9', '594:5', '602:5', '602:15', '603:10', '603:15', '604:4', '604:9', '604:14', '604:15'];

	// prefetch the previous and next data for better UX
	$: {
		if ([2, 3].includes($__fontType)) {
			for (let thisPage = +page - 2; thisPage <= +page + 2; thisPage++) {
				fetch(`${mushafFontLinks.COLRv1}/QCF4${`00${thisPage}`.slice(-3)}_COLOR-Regular.woff`);
				fetch(`${apiEndpoint}/page?page=${thisPage}&word_type=${selectableFontTypes[$__fontType].apiId}&word_translation=${$__wordTranslation}&v=92827326`);
			}
		}
	}

	$: {
		// empty all the arrays
		(chapters = []), (verses = []), (lines = []);

		pageData = (async () => {
			const apiURL = `${apiEndpoint}/page?page=${page}&word_type=${selectableFontTypes[$__fontType].apiId}&word_translation=${$__wordTranslation}&v=92827326`;
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

			// update mushaf page divisions
			$__mushafPageDivisions[page] = {
				chapters: chapters,
				juz: apiData[Object.keys(apiData)[0]].meta.juz
			};

			// dynamically load header font
			loadFont('chapter-headers', `${mushafFontLinks.header}?v=${mushafFontLinks.version}`).then(() => {
				document.querySelectorAll('.header').forEach((element) => {
					element.classList.remove('invisible');
				});
			});

			return apiData;
		})();

		// set the page number
		__pageNumber.set(page);

		// update the last read page
		const key = JSON.parse(localStorage.getItem('userSettings')).lastRead.key;
		updateSettings({ type: 'lastRead', value: { key: key !== undefined ? key : '1:1', page } });
	}

	// function to load the next page when user scrolls down
	function loadNextPage() {
		import('./SinglePage.svelte').then((res) => (SinglePageComponent = res.default));

		// get the last page number
		const lastPage = +document.querySelector('#page-block').lastElementChild.previousElementSibling.id;

		// remove the existing button
		document.getElementById('loadPageButton').remove();

		// setting the next page
		nextPageToLoad = lastPage + 1;
	}
</script>

{#await pageData}
	<Spinner height="screen" margin="-mt-20" />
{:then}
	<div
		id={+page}
		class="space-y-2 mt-2.5"
		use:inview={options}
		on:inview_enter={(event) => {
			__pageNumber.set(+event.target.id);
		}}
	>
		<div class="max-w-3xl space-y-2 pb-2 mx-auto text-[5.4vw] md:text-[42px] lg:text-[36px]">
			{#each Array.from(Array(endingLine + 1).keys()).slice(startingLine) as line}
				<!-- if it's the first verse of a chapter -->
				{#if chapters.length > 0 && lines.includes(line) && verses[lines.indexOf(line)] === 1}
					<div class="flex flex-col my-2">
						<div style="font-family: chapter-headers" class="header invisible leading-base pt-4 md:pt-8 pb-6 text-[28vw] md:text-[220px] lg:text-[230px]">{chapterHeaderCodes[chapters[lines.indexOf(line)]]}</div>

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
		<div class="max-w-3xl mx-auto justify-center text-sm theme">
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

<!-- <div id="loadPageButton" class="flex justify-center pt-6 pb-18" use:inview={loadButtonOptions} on:inview_enter={(event) => document.querySelector('#loadPageButton > button').click()}> -->
{#if page < 604}
	<div id="loadPageButton" class="flex justify-center pt-6">
		<button class="text-sm {buttonOutlineClasses}" on:click={() => loadNextPage()}> Continue Reading </button>
	</div>
{/if}

<svelte:component this={SinglePageComponent} page={nextPageToLoad} />
