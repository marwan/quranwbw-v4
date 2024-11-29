<!-- component to load verses for supplications and bookmarks -->
<script>
	export let key, value;

	import WordByWord from '$display/layouts/WordByWord.svelte';
	import Normal from '$display/layouts/Normal.svelte';
	import TranslationTransliteration from '$display/layouts/TranslationTransliteration.svelte';
	import { __displayType } from '$utils/stores';

	const allowedDisplayTypes = [1, 2, 7];

	const displayComponents = {
		1: { component: WordByWord },
		2: { component: Normal },
		7: { component: TranslationTransliteration }
	};

	// Only allow display type 1, 2, & 7, and don't save the layout in settings if not allowed
	if (!allowedDisplayTypes.includes(get(__displayType))) {
		__displayType.set(1);
	}
</script>

<svelte:component this={displayComponents[$__displayType].component} {key} {value} />
