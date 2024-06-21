<script>
	export let key;
	export let value;
	export let keyPages;

	import { quranMetaData, startPageOfChapters, pageNumberKeys, juzNumberKeys } from '$data/quranMeta';
	import { __chapterNumber, __currentPage } from '$utils/stores';

	let suggestionLinks = {};

	$: {
		if ($__currentPage === 'page') {
			switch (key) {
				case 'chapter':
					suggestionLinks[0] = {
						link: `/page/${startPageOfChapters[value]}`,
						title: `Chapter ${value} (${quranMetaData[value].transliteration})`
					};
					break;

				case 'page':
					suggestionLinks[1] = {
						link: `/page/${value}`,
						title: `Page ${value}`
					};
					break;

				case 'juz':
					suggestionLinks[2] = {
						link: `/page/${keyPages[juzNumberKeys[value - 1]]}`,
						title: `Juz ${value}`
					};
					break;

				case 'key':
					const page = keyPages[value];
					suggestionLinks[3] = {
						link: `/page/${page}`,
						title: `${quranMetaData[value.split(':')[0]].transliteration}, Verse ${value.split(':')[1]} (Page ${page})`
					};
					break;
			}
		} else if ($__currentPage !== 'page') {
			switch (key) {
				case 'chapter':
					suggestionLinks['0'] = {
						link: `/${value}`,
						title: `Chapter ${value} (${quranMetaData[value].transliteration})`
					};
					break;

				case 'verse':
					suggestionLinks['1'] = {
						link: `/${$__chapterNumber}/${value}`,
						title: `Verse ${value} (Current Chapter)`
					};
					break;

				case 'page':
					const pageChapter = pageNumberKeys[value - 1].split(':')[0];
					suggestionLinks['2'] = {
						link: `/${pageChapter}/${pageNumberKeys[value - 1].split(':')[1]}`,
						title: `Page ${value} (${quranMetaData[pageChapter].transliteration})`
					};
					break;

				case 'juz':
					const juzChapter = juzNumberKeys[value - 1].split(':')[0];
					suggestionLinks['3'] = {
						link: `/${juzChapter}/${juzNumberKeys[value - 1].split(':')[1]}`,
						title: `Juz ${value} (${quranMetaData[juzChapter].transliteration})`
					};
					break;

				case 'key':
					const keyChapter = value.split(':')[0];
					const keyVerse = value.split(':')[1];
					suggestionLinks['4'] = {
						link: `/${keyChapter}/${keyVerse}`,
						title: `${quranMetaData[keyChapter].transliteration}, Verse ${keyVerse}`
					};
					break;
			}
		}
	}
</script>

{#each Object.entries(suggestionLinks) as [key, value]}
	<a href={value.link} class="font-semibold hover:underline">{@html '&#10230'} {value.title}</a>
{/each}

{#if key === 'word'}
	<a href="/morphology/{value}" class="font-semibold hover:underline">{@html '&#10230'} Word {value} Morphology</a>
{/if}
