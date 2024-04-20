<script>
	import { Link } from 'svelte-routing';
	import { quranMetaData, mostRead } from '$data/quranMeta';
	import { fetchChapterData } from '$utils/fetchChapterData';
	import { __lastRead, __favouriteChapters } from '$utils/stores';

	import { inview } from 'svelte-inview';

	// chapter data fetch options
	const fetchOptions = {
		rootMargin: '10px',
		unobserveOnEnter: true
	};

	// chapter cards, tab styles
	const homepageTabsStyles = {
		cardGridStyle: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
		cardInnerStyle: 'flex items-center justify-between border border-gray-200 text-sm bg-gray-50 rounded-lg p-5 hover:cursor-pointer hover:bg-[#ebebeb] hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:bg-slate-700',
		tabStyle: 'py-2 px-4 text-xs cursor-pointer rounded-lg hover:bg-[#ebebeb] dark:hover:bg-slate-700',
		activeTab: 'bg-[#ebebeb] dark:bg-slate-700'
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
	<div class="mb-4 text-gray-400 dark:border-gray-700">
		<ul class="flex flex-wrap text-sm font-medium text-center justify-center space-x-2 md:space-x-4">
			<li>
				<button on:click={() => (activeTab = 1)} class="{homepageTabsStyles.tabStyle} {activeTab === 1 ? `${homepageTabsStyles.activeTab}` : ''}" id="chapters-tab" data-tabs-target="#chapters-tab-panel" type="button" role="tab" aria-controls="chapters-tab-panel" aria-selected="false">Chapters</button>
			</li>
			<li>
				<button on:click={() => (activeTab = 2)} class="{homepageTabsStyles.tabStyle} {activeTab === 2 ? `${homepageTabsStyles.activeTab}` : ''}" id="most-read-tab" data-tabs-target="#most-read-tab-panel" type="button" role="tab" aria-controls="most-read-tab-panel" aria-selected="false">Most Read</button>
			</li>
			<li>
				<Link to="/{$__lastRead.split(':')[0]}/{$__lastRead.split(':')[1]}" class={homepageTabsStyles.tabStyle} id="last-read-tab" data-tabs-target="#most-read-tab-panel" type="button" role="tab" aria-controls="most-read-tab-panel" aria-selected="false">Last Read ({$__lastRead})</Link>
			</li>
		</ul>
	</div>

	<div id="content-tab" class="my-6 px-2">
		<!-- chapters tab -->
		<div class="homepage-tab-panels {activeTab === 1 ? 'block' : 'hidden'}" id="chapters-tab-panel" role="tabpanel" aria-labelledby="chapters-tab">
			<div class={homepageTabsStyles.cardGridStyle}>
				{#each { length: 114 } as _, chapter}
					<Link to="/{chapter + 1}" class={homepageTabsStyles.cardInnerStyle}>
						<div class="" use:inview={fetchOptions} on:inview_enter={(event) => fetchChapterData(+chapter + 1)}>
							<span class="text-sm">{chapter + 1}. {quranMetaData[chapter + 1].transliteration}</span>
							<div class="block text-xs text-gray-400">
								{quranMetaData[chapter + 1].translation} <br />
								{quranMetaData[chapter + 1].verses} Verses &bull; {quranMetaData[chapter + 1].revelation === 1 ? 'Meccan' : 'Medinan'}
							</div>
						</div>
						<div class="invisible chapter-icons justify-items-end text-gray-400 text-3xl mt-2">{@html `&#xE9${quranMetaData[chapter + 1].icon};`}</div>
					</Link>
				{/each}
			</div>
		</div>

		<!-- most read tab -->
		<div class="homepage-tab-panels space-y-12 {activeTab === 2 ? 'block' : 'hidden'}" id="most-read-tab-panel" role="tabpanel" aria-labelledby="most-read-tab">
			<!-- <div id="favourite-chapters" class="flex flex-col space-y-4">
        <div class="text-sm text-center font-medium">Your Favourites</div>
        <div class={homepageTabsStyles.cardGridStyle}>
          {#each $__favouriteChapters as chapter, index}
            <Link to="/{chapter}" class={homepageTabsStyles.cardInnerStyle}>
              <div class="">
                <span class="text-sm">{quranMetaData[chapter].transliteration}</span>
              </div>
            </Link>
          {/each}
        </div>
      </div> -->
			<div id="most-read-chapters" class="flex flex-col space-y-4">
				<!-- <div class="text-sm text-center font-medium">Recommended by QuranWBW</div> -->
				<div class={homepageTabsStyles.cardGridStyle}>
					{#each Object.entries(mostRead) as [id, item]}
						<Link to={item.url} class={homepageTabsStyles.cardInnerStyle}>
							<div class="">
								<span class="text-sm">{quranMetaData[item.chapter].transliteration} ({item.verses})</span>
								<div class="block text-xs text-gray-400">{item.title}</div>
							</div>
						</Link>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
