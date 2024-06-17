<script>
	import Modal from '$ui/flowbite-svelte/modal/Modal.svelte';
	import PointNavigationSelector from '$ui/PointNavigationSelector.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { quranMetaData, startPageOfChapters } from '$data/quranMeta';
	import { buttonClasses } from '$data/commonClasses';
	import { __chapterNumber, __pageURL, __currentPage, __pageNumber, __chapterNavigationModalVisible } from '$utils/stores';
	import { inview } from 'svelte-inview';

	let maxChaptersLoaded = false;
	let maxVersesLoaded = false;
	let maxItemsToLoad = 20;
	let maxVersesToLoad = 1;

	const listItemClasses = 'py-2 px-2 text-sm hover:bg-black/5 w-full text-left font-normal rounded-3xl';

	$: if ($__pageURL || $__chapterNumber || $__pageNumber) __chapterNavigationModalVisible.set(false);

	$: chapterVerses = quranMetaData[$__chapterNumber].verses;

	$: {
		maxVersesLoaded = false;
		maxVersesToLoad = chapterVerses > maxItemsToLoad ? maxItemsToLoad : chapterVerses;
	}

	function loadMaxChapters() {
		if (!maxChaptersLoaded) {
			maxItemsToLoad = 114;
			maxChaptersLoaded = true;
		}
	}

	function loadMaxVerses() {
		if (!maxVersesLoaded) {
			maxVersesToLoad = chapterVerses;
			maxVersesLoaded = true;
		}
	}
</script>

<Modal id="chapterNavigationModal" title="Navigate" bind:open={$__chapterNavigationModalVisible} size="sm" class="rounded-3xl text-black theme" bodyClass="p-2 !border-t-0" headerClass="hidden" center outsideclose>
	<div class="flex flex-col space-y-4 justify-between max-w-screen-lg px-4 py-5 mx-auto md:px-2">
		<div class="mx-2">
			<PointNavigationSelector />
		</div>

		<!-- chapter and verse selectors -->
		<div class="flex flex-row space-x-4 max-h-80">
			<!-- chapter selector -->
			<div class="flex flex-col space-y-2 w-full">
				<div class="mx-4 text-sm pb-2 border-b font-medium">Chapters</div>
				<ul id="navbar-chapter-list" class="grow basis-1/2 px-2 overflow-y-scroll">
					{#each { length: maxItemsToLoad } as _, chapter}
						<li>
							<a href={$__currentPage === 'chapter' ? `/${chapter + 1}` : `/page/${startPageOfChapters[chapter + 1]}`}>
								<div class="{listItemClasses} {$__currentPage === 'chapter' ? (chapter + 1 === $__chapterNumber ? 'bg-black/5' : null) : null}">
									{chapter + 1}. {quranMetaData[chapter + 1].transliteration}
									<span class="hidden md:inline-block">({quranMetaData[chapter + 1].translation})</span>
								</div>
							</a>
						</li>
					{/each}
					{#if !maxChaptersLoaded}
						<Spinner size="8" />
					{/if}
					<div class="invisible" use:inview on:inview_enter={() => loadMaxChapters()}></div>
				</ul>
			</div>

			<!-- verse selector -->
			{#if $__currentPage === 'chapter'}
				<div class="flex flex-col space-y-2 w-44">
					<div class="mx-4 text-sm pb-2 border-b font-medium">Verses</div>
					<ul id="navbar-verse-list" class="grow basis-1/2 px-2 overflow-y-scroll">
						{#key $__chapterNumber}
							{#each { length: maxVersesToLoad } as _, verse}
								<li>
									<a href="/{$__chapterNumber}/{verse + 1}" on:click={() => __pageURL.set(Math.random())}>
										<div class={listItemClasses}>Verse {verse + 1}</div>
									</a>
								</li>
							{/each}
							{#if !maxVersesLoaded && chapterVerses > maxItemsToLoad}
								<Spinner size="8" />
							{/if}
						{/key}

						<div class="invisible" use:inview on:inview_enter={() => loadMaxVerses()}></div>
					</ul>
				</div>
			{/if}
		</div>

		<div class="w-full px-2">
			<button class="w-full {buttonClasses}" on:click={() => __chapterNavigationModalVisible.set(false)}>Close</button>
		</div>
	</div>
</Modal>
