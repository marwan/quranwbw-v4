<script>
	import { Link } from 'svelte-routing';
	import { updateSettings } from '$utils/updateSettings';
	import { quranMetaData, mostRead } from '$data/quranMeta';
	import { fetchChapterData } from '$utils/fetchChapterData';
	import { __lastRead, __favouriteChapters, __userBookmarks } from '$utils/stores';
	import { buttonElement } from '$data/commonStyles';
	import { Dropdown, DropdownItem, Tooltip } from 'flowbite-svelte';
	import { inview } from 'svelte-inview';

	// icons
	import Mecca from '$svgs/Mecca.svelte';
	import Madinah from '$svgs/Madinah.svelte';
	import Cross from '$svgs/Cross.svelte';

	let gotoVisible = false;

	const homepageLinks = {
		1: {
			title: 'Supplications',
			link: '/supplications'
		},
		2: {
			title: 'Bookmarks',
			link: '/bookmarks'
		},
		3: {
			title: 'Search',
			link: '/search'
		},
		4: {
			title: 'Morphology',
			link: '/morphology/1:1'
		},
		5: {
			title: 'FAQs',
			link: '/faq'
		}
	};

	// chapter data fetch options
	const fetchOptions = {
		rootMargin: '10px',
		unobserveOnEnter: true
	};

	// chapter cards, tab styles
	const homepageTabsStyles = {
		cardGridStyle: 'grid md:grid-cols-2 lg:grid-cols-3 gap-3',
		cardInnerStyle: 'flex justify-between md:text-left border border-gray-200 transition text-sm bg-gray-50 rounded-3xl p-5 hover:cursor-pointer hover:bg-[#ebebeb]',
		tabStyle: 'p-2 md:p-4 text-xs md:text-md cursor-pointer border-b-0',
		activeTab: 'border-b-4'
	};

	let activeTab = 1; // chapters tab

	// remove the "invisible" class from chapter-icons once fonts are loaded so blank icon doesn't show up
	document.fonts.ready.then(function () {
		document.querySelectorAll('.chapter-icons').forEach((element) => {
			element.classList.remove('invisible');
		});
	});
</script>

<div id="homepage-tabs" class="pt-0">
	<div class="flex flex-row justify-between mb-4 text-gray-400 px-4">
		<!-- main tabs on left -->
		<div id="tab-buttons">
			<ul class="flex text-sm font-medium text-center justify-center space-x-2 md:space-x-4">
				<li>
					<button on:click={() => (activeTab = 1)} class="{homepageTabsStyles.tabStyle} {activeTab === 1 ? `${homepageTabsStyles.activeTab}` : ''}" id="chapters-tab" data-tabs-target="#chapters-tab-panel" type="button" role="tab" aria-controls="chapters-tab-panel" aria-selected="false">Chapters</button>
				</li>
				<li>
					<button on:click={() => (activeTab = 2)} class="{homepageTabsStyles.tabStyle} {activeTab === 2 ? `${homepageTabsStyles.activeTab}` : ''}" id="most-read-tab" data-tabs-target="#most-read-tab-panel" type="button" role="tab" aria-controls="most-read-tab-panel" aria-selected="false">Suggested</button>
				</li>
				<li>
					<button on:click={() => (activeTab = 3)} class="{homepageTabsStyles.tabStyle} {activeTab === 3 ? `${homepageTabsStyles.activeTab}` : ''}" id="bookmarks-tab" data-tabs-target="#bookmarks-tab-panel" type="button" role="tab" aria-controls="bookmarks-tab-panel" aria-selected="false">Bookmarks</button>
				</li>
			</ul>
		</div>

		<!-- menu for links on right -->
		<div>
			<button class={homepageTabsStyles.tabStyle} id="naviagte-tab" type="button">Navigate</button>
			<Dropdown class="max-w-min">
				{#each Object.entries(homepageLinks) as [id, link]}
					<Link to={link.link}>
						<DropdownItem>{link.title}</DropdownItem>
					</Link>
				{/each}
			</Dropdown>
		</div>
	</div>

	<div id="content-tab" class="my-6 px-2">
		<!-- chapters tab -->
		<div class="homepage-tab-panels {activeTab === 1 ? 'block' : 'hidden'}" id="chapters-tab-panel" role="tabpanel" aria-labelledby="chapters-tab">
			{#if gotoVisible === false}
				<div id="navigatation-handler" class="flex mb-4">
					<button class="{buttonElement} text-xs" on:click={() => (gotoVisible = !gotoVisible)}>Go to...</button>
				</div>
			{/if}

			{#if gotoVisible === true}
				<div id="navigatation-inputs" class="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0 mb-4">
					<div class="flex flex-row">
						<input type="number" min="1" max="114" id="gotoPage" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-3xl focus:ring-gray-500 focus:border-gray-500 block w-24 p-2.5" placeholder="e.g. {Math.floor(Math.random() * 114) + 1}" />
						<button class="{buttonElement} text-xs rounded-l-none">Go to Chapter {@html '&#10230'}</button>
					</div>

					<div class="flex flex-row">
						<input type="number" min="1" max="604" id="gotoPage" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-3xl focus:ring-gray-500 focus:border-gray-500 block w-24 p-2.5" placeholder="e.g. {Math.floor(Math.random() * 604) + 1}" />
						<button class="{buttonElement} text-xs rounded-l-none">Go to Page {@html '&#10230'}</button>
					</div>

					<div class="flex flex-row">
						<input type="number" min="1" max="30" id="gotoPage" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-3xl focus:ring-gray-500 focus:border-gray-500 block w-24 p-2.5" placeholder="e.g. {Math.floor(Math.random() * 30) + 1}" />
						<button class="{buttonElement} text-xs rounded-l-none">Go to Juz {@html '&#10230'}</button>
					</div>
				</div>
			{/if}

			<div class="{homepageTabsStyles.cardGridStyle} grid-cols-2">
				{#each { length: 114 } as _, chapter}
					<Link to="/{chapter + 1}" class="{homepageTabsStyles.cardInnerStyle} flex-col-reverse md:flex-row text-center items-center">
						<div class="" use:inview={fetchOptions} on:inview_enter={(event) => fetchChapterData(+chapter + 1)}>
							<!-- chapter name and icon -->
							<div class="flex flex-row items-center space-x-1 justify-center truncate">
								<div>{chapter + 1}. {quranMetaData[chapter + 1].transliteration}</div>
								<div class="opacity-50"><svelte:component this={quranMetaData[chapter + 1].revelation === 1 ? Mecca : Madinah} /></div>
								<Tooltip type="light" placement="right" class="z-30">{quranMetaData[chapter + 1].revelation === 1 ? 'Meccan' : 'Medinan'} revelation</Tooltip>
							</div>

							<!-- chapter translation -->
							<div class="block text-xs text-gray-400 truncate">
								{quranMetaData[chapter + 1].translation}
							</div>

							<!-- chapter verses -->
							<div class="block text-xs text-gray-400">
								{quranMetaData[chapter + 1].verses} Verses
							</div>
						</div>
						<div class="invisible chapter-icons justify-items-end text-gray-400 text-3xl md:mt-2">{@html `&#xE9${quranMetaData[chapter + 1].icon};`}</div>
					</Link>
				{/each}
			</div>
		</div>

		<!-- most read tab -->
		<div class="homepage-tab-panels space-y-12 {activeTab === 2 ? 'block' : 'hidden'}" id="most-read-tab-panel" role="tabpanel" aria-labelledby="most-read-tab">
			<div id="most-read-chapters" class="flex flex-col space-y-4">
				<div class="{homepageTabsStyles.cardGridStyle} grid-cols-1">
					{#each Object.entries(mostRead) as [id, item]}
						<Link to={item.url} class="{homepageTabsStyles.cardInnerStyle} flex-col">
							<span class="text-sm">{quranMetaData[item.chapter].transliteration} ({item.verses})</span>
							<div class="block text-xs text-gray-400">{item.title}</div>
						</Link>
					{/each}
				</div>
			</div>
		</div>

		<!-- bookmarks tab -->
		<div class="bookmarks-tab-panels space-y-12 {activeTab === 3 ? 'block' : 'hidden'}" id="bookmarks-tab-panel" role="tabpanel" aria-labelledby="bookmarks-tab">
			<div id="bookmark-cards" class="flex flex-col space-y-4">
				{#if $__userBookmarks.length === 0}
					<div class="flex items-center justify-center text-sm">You currently do not have any bookmarked verses.</div>
				{:else}
					<div class="{homepageTabsStyles.cardGridStyle} grid-cols-1">
						{#each $__userBookmarks as bookmark}
							<div class="flex flex-row space-x-2">
								<Link to="{bookmark.split(':')[0]}/{bookmark.split(':')[1]}" class="{homepageTabsStyles.cardInnerStyle} flex-row items-center w-full">
									<div class="text-sm">{quranMetaData[bookmark.split(':')[0]].transliteration}, Verse {bookmark}</div>
									<div class="invisible chapter-icons justify-items-end text-gray-400 text-3xl mt-2">{@html `&#xE9${quranMetaData[bookmark.split(':')[0]].icon};`}</div>
								</Link>

								<button on:click={() => updateSettings({ type: 'userBookmarks', key: bookmark })} class="pointer h-7 w-7 opacity-50 hover:opacity-70" style="margin-left: -20px; margin-top: -5px;" title="Remove bookmark"><Cross width={7} height={7} /></button>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
