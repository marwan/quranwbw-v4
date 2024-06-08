<script>
	import PointNavigationSelector from '$ui/PointNavigationSelector.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import Dropdown from '$ui/flowbite-svelte/dropdown/Dropdown.svelte';
	import DropdownItem from '$ui/flowbite-svelte/dropdown/DropdownItem.svelte';
	import { quranMetaData } from '$data/quranMeta';
	import { __chapterNumber, __pageURL } from '$utils/stores';
	import { inview } from 'svelte-inview';

	let dropdownOpen = false;
	let maxChaptersLoaded = false;
	let maxVersesLoaded = false;
	let maxChaptersToLoad = 10;
	let maxVersesToLoad = 1;

	// when dropdown is toggled
	$: {
		if (dropdownOpen) {
			maxVersesLoaded = false;
			maxVersesToLoad = quranMetaData[window.chapter].verses > 10 ? 10 : quranMetaData[window.chapter].verses;
		}

		if (!dropdownOpen) {
			(maxChaptersLoaded = false), (maxVersesLoaded = false);
			maxVersesToLoad = quranMetaData[window.chapter].verses > 10 ? 10 : quranMetaData[window.chapter].verses;
			maxChaptersToLoad = 10;
		}
	}

	function loadMaxChapters() {
		if (!maxChaptersLoaded) {
			maxChaptersToLoad = 114;
			maxChaptersLoaded = true;
		}
	}

	function loadMaxVerses() {
		if (!maxVersesLoaded) {
			maxVersesToLoad = quranMetaData[window.chapter].verses;
			maxVersesLoaded = true;
		}
	}

	const dropdownItemClasses = 'font-normal rounded-3xl pl-2';
</script>

<Dropdown class="px-2 my-2 z-30" bind:open={dropdownOpen}>
	<div class="flex flex-col space-y-4 justify-between max-w-screen-lg px-4 py-5 mx-auto text-gray-900 md:px-2">
		<div class="mx-2">
			<PointNavigationSelector />
		</div>

		<!-- chapter and verse selectors -->
		<div class="flex flex-row space-x-4 max-h-80">
			<!-- chapter selector -->
			<div class="flex flex-col space-y-2 w-full">
				<div class="mx-4 text-sm pb-2 border-b font-medium">Chapters</div>
				<ul id="navbar-chapter-list" class="grow basis-1/2 px-2 overflow-y-scroll">
					{#each { length: maxChaptersToLoad } as _, chapter}
						<li>
							<a href="/{chapter + 1}">
								<DropdownItem class={dropdownItemClasses}>
									{chapter + 1}. {quranMetaData[chapter + 1].transliteration}
									<span class="hidden md:inline-block">({quranMetaData[chapter + 1].translation})</span>
								</DropdownItem>
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
			<div class="flex flex-col space-y-2 w-44">
				<div class="mx-4 text-sm pb-2 border-b font-medium">Verses</div>
				<ul id="navbar-verse-list" class="grow basis-1/2 px-2 overflow-y-scroll">
					{#each { length: maxVersesToLoad } as _, verse}
						<li>
							<a href="/{window.chapter}/{verse + 1}" on:click={() => __pageURL.set(Math.random())}>
								<DropdownItem class={dropdownItemClasses}>Verse {verse + 1}</DropdownItem>
							</a>
						</li>
					{/each}
					{#if !maxVersesLoaded}
						<Spinner size="8" />
					{/if}
					<div class="invisible" use:inview on:inview_enter={() => loadMaxVerses()}></div>
				</ul>
			</div>
		</div>
	</div>
</Dropdown>
