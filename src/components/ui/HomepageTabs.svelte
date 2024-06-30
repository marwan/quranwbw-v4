<script>
	import SiteNavigationDropdown from '$ui/SiteNavigationDropdown.svelte';
	import Mecca from '$svgs/Mecca.svelte';
	import Madinah from '$svgs/Madinah.svelte';
	import CrossSolid from '$svgs/CrossSolid.svelte';
	import Menu from '$svgs/Menu.svelte';
	import Tooltip from '$ui/flowbite-svelte/tooltip/Tooltip.svelte';
	import Search from '$svgs/Search.svelte';
	import { updateSettings } from '$utils/updateSettings';
	import { quranMetaData, mostRead } from '$data/quranMeta';
	import { __lastRead, __favouriteChapters, __userBookmarks, __timeSpecificChapters, __quranNavigationModalVisible } from '$utils/stores';
	import { buttonClasses, buttonOutlineClasses } from '$data/commonClasses';
	import { checkTimeSpecificChapters } from '$utils/checkTimeSpecificChapters';
	import { term } from '$utils/terminologies';

	let lastReadChapter = 1;
	let lastReadVerse = 1;

	$: {
		if ($__lastRead.hasOwnProperty('key')) {
			lastReadChapter = $__lastRead.key.split(':')[0];
			lastReadVerse = $__lastRead.key.split(':')[1];
		}
	}

	// chapter cards, tab styles
	const cardGridClasses = 'grid md:grid-cols-2 lg:grid-cols-3 gap-3';
	const cardInnerClasses = 'flex justify-between md:text-left border border-black/10 transition text-sm bg-gray-100 rounded-3xl p-5 hover:cursor-pointer hover:bg-lightGray';
	const tabClasses = 'p-2 md:p-3 text-xs md:text-md cursor-pointer border-b-0';
	const activeTabClasses = 'border-b-4';

	let activeTab = 1; // chapters tab

	// remove the "invisible" class from chapter-icons once fonts are loaded so blank icon doesn't show up
	document.fonts.ready.then(function () {
		document.querySelectorAll('.chapter-icons').forEach((element) => {
			element.classList.remove('invisible');
		});
	});

	// check if it's friday and night
	checkTimeSpecificChapters();
</script>

<div id="homepage-tabs" style="margin-top: 15px;" class="theme-grayscale">
	<div class="flex items-center justify-center px-2 mb-4">
		<!-- <div class="hidden md:block flex-1 border-t border-black/10"></div> -->

		<div class="flex flex-row justify-center px-4">
			<!-- main tabs on left -->
			<div id="tab-buttons">
				<ul class="flex text-sm font-medium text-center opacity-70 justify-center space-x-2 md:space-x-4">
					<li>
						<button on:click={() => (activeTab = 1)} class="{tabClasses} {activeTab === 1 ? `${activeTabClasses}` : null}" id="chapters-tab" data-tabs-target="#chapters-tab-panel" type="button" role="tab" aria-controls="chapters-tab-panel" aria-selected="false">{term('chapters')}</button>
					</li>
					<li>
						<button on:click={() => (activeTab = 2)} class="{tabClasses} {activeTab === 2 ? `${activeTabClasses}` : null}" id="most-read-tab" data-tabs-target="#most-read-tab-panel" type="button" role="tab" aria-controls="most-read-tab-panel" aria-selected="false">Suggested</button>
					</li>
					<li>
						<button on:click={() => (activeTab = 3)} class="{tabClasses} {activeTab === 3 ? `${activeTabClasses}` : null}" id="bookmarks-tab" data-tabs-target="#bookmarks-tab-panel" type="button" role="tab" aria-controls="bookmarks-tab-panel" aria-selected="false">
							Bookmarks
							{#if $__userBookmarks.length > 0}
								({$__userBookmarks.length})
							{/if}
						</button>
					</li>
				</ul>
			</div>

			<!-- menu for links on right -->
			<div class="ml-2">
				<button class="flex flex-row items-center bg-lightGray rounded-3xl p-3 {tabClasses}" title="Menu">
					<span class="text-black opacity-70"><Menu /></span>
				</button>
				<SiteNavigationDropdown />
			</div>
		</div>

		<!-- <div class="hidden md:block flex-1 border-t border-black/10"></div> -->
	</div>

	<div class="hidden md:block border-b -mt-4 px-4 mx-auto w-[98%] theme-grayscale"></div>

	<div id="content-tab" class="my-6 px-2">
		<!-- chapters tab -->
		<div class="homepage-tab-panels {activeTab === 1 ? 'block' : 'hidden'}" id="chapters-tab-panel" role="tabpanel" aria-labelledby="chapters-tab">
			<!-- chapter / page etc... selector -->
			<div class="flex flex-col space-y-2 md:space-y-0 md:flex-row justify-between text-xs mb-0 md:mb-2">
				<!-- search bar -->
				<button class="w-full md:w-max" on:click={() => __quranNavigationModalVisible.set(true)}>
					<span class="w-full pointer-events-none {buttonOutlineClasses}">
						<span class="pt-1"><Search size={4} /></span>
						<span>Navigate or Search Quran</span>
					</span>
				</button>

				<!-- time specific chapter buttons and last read -->
				<div class="flex flex-row space-x-2 md:flex-row-reverse md:space-x-1">
					<!-- last read -->
					{#if $__lastRead.key !== null}
						<div id="last-read">
							<a href="/{lastReadChapter}/{lastReadVerse}" class="hidden md:block py-2.5 w-full mb-4 md:mb-0 truncate {buttonClasses}">Continue Reading: {quranMetaData[lastReadChapter].transliteration}, {lastReadChapter}:{lastReadVerse} {@html '&#10230'}</a>
							<a href="/{lastReadChapter}/{lastReadVerse}" class="block md:hidden py-2.5 w-full mb-4 md:mb-0 truncate {buttonClasses}">Continue: {lastReadChapter}:{lastReadVerse} {@html '&#10230'}</a>
						</div>
					{/if}

					<!-- show Al Kahf on Friday -->
					{#if $__timeSpecificChapters.isFriday}
						<div id="al-kahf" class="w-full md:w-max">
							<a href="/18" class="py-2.5 w-full mb-4 md:mb-0 {buttonOutlineClasses}">
								Al-Kahf
								<span class="hidden md:block">{@html '&#10230'}</span>
							</a>
						</div>
					{/if}

					<!-- show Al Mulk at night/evening -->
					{#if $__timeSpecificChapters.isNight}
						<div id="al-mulk" class="w-full md:w-max">
							<a href="/67" class="py-2.5 w-full mb-4 md:mb-0 {buttonOutlineClasses}">
								Al-Mulk
								<span class="hidden md:block">{@html '&#10230'}</span>
							</a>
						</div>
					{/if}
				</div>
			</div>

			<div class="{cardGridClasses} grid-cols-2">
				{#each { length: 114 } as _, chapter}
					<a href="/{chapter + 1}">
						<!-- <button class="pointer h-7 w-7 rounded-full bg-gray-300 text-xs">{chapter + 1}</button> -->

						<div class="{cardInnerClasses} flex-col-reverse md:flex-row text-center items-center">
							<div class="">
								<!-- chapter name and icon -->
								<div class="flex flex-row items-center space-x-1 justify-center md:justify-start truncate">
									<div>{chapter + 1}. {quranMetaData[chapter + 1].transliteration}</div>
									<div class="opacity-50"><svelte:component this={quranMetaData[chapter + 1].revelation === 1 ? Mecca : Madinah} /></div>
									<Tooltip arrow={false} type="light" placement="top" class="z-30 hidden md:block font-filter font-normal">{quranMetaData[chapter + 1].revelation === 1 ? 'Meccan' : 'Medinan'} revelation</Tooltip>
								</div>

								<!-- chapter translation -->
								<div class="block text-xs opacity-70 truncate">
									{quranMetaData[chapter + 1].translation}
								</div>

								<!-- chapter verses -->
								<div class="block text-xs opacity-70">
									{quranMetaData[chapter + 1].verses}
									{term('verses')}
								</div>
							</div>
							<div class="invisible chapter-icons justify-items-end opacity-70 text-3xl md:mt-2">{@html `&#xE9${quranMetaData[chapter + 1].icon};`}</div>
						</div>
					</a>
				{/each}
			</div>
		</div>

		<!-- most read tab -->
		<div class="homepage-tab-panels space-y-12 {activeTab === 2 ? 'block' : 'hidden'}" id="most-read-tab-panel" role="tabpanel" aria-labelledby="most-read-tab">
			<div id="most-read-chapters" class="flex flex-col space-y-4">
				<div class="{cardGridClasses} grid-cols-1">
					{#each Object.entries(mostRead) as [id, item]}
						<a href={item.url} class="{cardInnerClasses} flex-col">
							<span class="text-sm">{quranMetaData[item.chapter].transliteration} ({item.verses})</span>
							<div class="block text-xs opacity-70">{item.title}</div>
						</a>
					{/each}
				</div>
			</div>
		</div>

		<!-- bookmarks tab -->
		<div class="bookmarks-tab-panels space-y-12 {activeTab === 3 ? 'block' : 'hidden'}" id="bookmarks-tab-panel" role="tabpanel" aria-labelledby="bookmarks-tab">
			<div id="bookmark-cards" class="flex flex-col space-y-4">
				{#if $__userBookmarks.length === 0}
					<div class="flex items-center justify-center text-sm opacity-70">You currently do not have any bookmarked {term('verses')}.</div>
				{:else}
					<div class="{cardGridClasses} grid-cols-1">
						{#each $__userBookmarks as bookmark}
							<div class="flex flex-row space-x-2">
								<a href="{bookmark.split(':')[0]}/{bookmark.split(':')[1]}" class="{cardInnerClasses} flex-row items-center w-full">
									<div class="text-sm">{quranMetaData[bookmark.split(':')[0]].transliteration}, {term('verse')} {bookmark}</div>
									<div class="invisible chapter-icons justify-items-end opacity-70 text-3xl mt-2">{@html `&#xE9${quranMetaData[bookmark.split(':')[0]].icon};`}</div>
								</a>

								<button on:click={() => updateSettings({ type: 'userBookmarks', key: bookmark })} class="pointer h-7 w-7 opacity-50 hover:opacity-70" style="margin-left: -20px; margin-top: -5px;" title="Remove bookmark"><CrossSolid size={7} /></button>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
