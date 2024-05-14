<script>
	import { navigate } from 'svelte-routing';
	import { pageNumberKeys } from '$data/quranMeta';
	import { __pageURL } from '$utils/stores';
	import { buttonElement, disabledElement } from '$data/commonStyles';
	import { Select } from 'flowbite-svelte';
	import { validateKey } from '$utils/validateKey';

	let waypoint = '',
		placeholder = 'chapter, verse or key',
		selectedNavigation,
		incorrectValue = false;

	const navigationPoints = [
		{ value: 1, name: 'Chapter' },
		{ value: 2, name: 'Page' },
		{ value: 3, name: 'Key' }
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
					incorrectValue = validateKey(waypoint) === false ? true : false;
					placeholder = `e.g. 18:10`;
					break;
			}
			if (waypoint === '') incorrectValue = true;
		} catch (error) {
			// ...
		}
	}

	function navigateToPoint() {
		const waypoint = document.getElementById('navigationInput').value;

		__pageURL.set(Math.random());

		switch (selectedNavigation) {
			case 1:
				navigate(`/${waypoint}`, { replace: true });
				break;

			case 2:
				const pageKey = pageNumberKeys[waypoint - 1].split(':');
				navigate(`/${+pageKey[0]}/${+pageKey[1]}`, { replace: true });
				break;

			case 3:
				const chapter = waypoint.split(':')[0],
					verse = waypoint.split(':')[1];
				navigate(`/${+chapter}/${+verse}`, { replace: true });
				break;
		}
	}
</script>

<div id="navigatation-inputs" class="flex mb-4 justify-start">
	<div class="flex flex-row w-full md:w-2/5">
		<Select class="w-fit rounded-l-3xl rounded-r-none" items={navigationPoints} bind:value={selectedNavigation} placeholder="Go to..." />
		<input type="text" bind:value={waypoint} id="navigationInput" aria-describedby="helper-text-explanation" class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-none focus:ring-gray-500 focus:border-gray-500 block w-24 p-2.5" {placeholder} />
		<button class="{buttonElement} text-xs rounded-l-none min-w-fit {incorrectValue === true && disabledElement}" on:click={() => navigateToPoint()}>Go {@html '&#10230'}</button>
	</div>
</div>
