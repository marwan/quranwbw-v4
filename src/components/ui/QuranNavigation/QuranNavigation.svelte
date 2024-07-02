<script>
	import Modal from '$ui/flowbite-svelte/modal/Modal.svelte';
	import Drawer from '$ui/flowbite-svelte/drawer/Drawer.svelte';
	import QuranNavInnerSearch from '$ui/QuranNavigation/QuranNavInnerSearch.svelte';
	import { __quranNavigationModalVisible, __quranNavigationDrawerHidden } from '$utils/stores';
	import { sineIn } from 'svelte/easing';

	const transitionParamsTop = {
		y: -320,
		duration: 200,
		easing: sineIn
	};
</script>

<Drawer id="quranNavigationDrawer" bind:hidden={$__quranNavigationDrawerHidden} class="overflow-y-auto z-50 p-0 bg-white rounded-b-3xl" placement="top" width="w-full" transitionType="fly" transitionParams={transitionParamsTop}>
	<QuranNavInnerSearch />
</Drawer>

<Modal id="quranNavigationModal" bind:open={$__quranNavigationModalVisible} title="Navigate" size="sm" class="rounded-3xl text-black theme" bodyClass="p-2 !border-t-0" headerClass="hidden" placement="center" outsideclose>
	<QuranNavInnerSearch />
</Modal>
