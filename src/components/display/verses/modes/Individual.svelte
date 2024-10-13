<!-- component to load verses for supplications and bookmarks -->
<script>
	export let key, value;

	import WordByWord from '$display/layouts/WordByWord.svelte';
	import Normal from '$display/layouts/Normal.svelte';
	import TranslationTransliteration from '$display/layouts/TranslationTransliteration.svelte';
	import { __displayType } from '$utils/stores';

	const displayComponents = {
		1: { component: WordByWord },
		2: { component: Normal },
		7: { component: TranslationTransliteration }
	};

	// only allow display type 1, 2 & 7, and don't save the layout in settings
	if (![1, 2, 7].includes($__displayType)) __displayType.set(1);
</script>

<svelte:component this={displayComponents[$__displayType].component} {key} {value} />
