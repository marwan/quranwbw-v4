<script>
	import { navigate } from 'svelte-routing';
	import { pageNumberKeys, juzNumberKeys } from '$data/quranMeta';
	import { __pageURL } from '$utils/stores';
	import { buttonElement, disabledElement } from '$data/commonStyles';
	import { Select } from 'flowbite-svelte';
	import { validateKey } from '$utils/validateKey';

	let waypoint = '',
		placeholder = 'chapter, page, juz or key',
		selectedNavigation,
		incorrectValue = false;

	const navigationPoints = [
		{ value: 1, name: 'Chapter' },
		{ value: 2, name: 'Page' },
		{ value: 3, name: 'Juz' },
		{ value: 4, name: 'Key' }
	];

	// basic checks
	$: {
		try {
			switch (selectedNavigation) {
				case 1:
					incorrectValue = waypoint < 1 || waypoint > 114 ? true : false;
					placeholder = `e.g. ${Math.floor(Math.random() * 114) + 1}`;
					if (isNaN(waypoint)) incorrectValue = true;
					break;

				case 2:
					incorrectValue = waypoint < 1 || waypoint > 604 ? true : false;
					placeholder = `e.g. ${Math.floor(Math.random() * 604) + 1}`;
					if (isNaN(waypoint)) incorrectValue = true;
					break;

				case 3:
					incorrectValue = waypoint < 1 || waypoint > 30 ? true : false;
					placeholder = `e.g. ${Math.floor(Math.random() * 30) + 1}`;
					if (isNaN(waypoint)) incorrectValue = true;
					break;

				case 4:
					incorrectValue = !validateKey(waypoint) ? true : false;
					placeholder = `e.g. 18:10`;
					break;
			}
			if (waypoint === '') incorrectValue = true;
		} catch (error) {
			// ...
		}
	}

	function navigateToPoint() {
		__pageURL.set(Math.random());

		switch (selectedNavigation) {
			case 1:
				navigate(`/${waypoint}`, { replace: false });
				break;

			case 2:
				const pageKey = pageNumberKeys[waypoint - 1].split(':');
				navigate(`/${+pageKey[0]}/${+pageKey[1]}`, { replace: false });
				break;

			case 3:
				const juzKey = juzNumberKeys[waypoint - 1].split(':');
				navigate(`/${+juzKey[0]}/${+juzKey[1]}`, { replace: false });
				break;

			case 4:
				const chapter = waypoint.split(':')[0],
					verse = waypoint.split(':')[1];
				navigate(`/${+chapter}/${+verse}`, { replace: false });
				break;
		}
	}
</script>

<div id="navigatation-inputs" class="flex mb-4 justify-start theme-grayscale">
	<div class="flex flex-row w-full">
		<Select class="w-fit rounded-l-3xl rounded-r-none focus:border-gray-500 text-xs" items={navigationPoints} bind:value={selectedNavigation} placeholder="Go to..." />
		<input type="text" bind:value={waypoint} id="navigationInput" aria-describedby="helper-text-explanation" class="w-[inherit] bg-gray-50 border border-gray-300 border-l-0 border-r-0 text-gray-900 text-xs rounded-l-none focus:ring-gray-500 focus:border-gray-500 block w-24 p-2.5" {placeholder} />
		<button class="{buttonElement} h-[86%] text-xs rounded-l-none min-w-fit border border-gray-300 {incorrectValue === true && disabledElement}" on:click={() => navigateToPoint()}>Go {@html '&#10230'}</button>
	</div>
</div>
