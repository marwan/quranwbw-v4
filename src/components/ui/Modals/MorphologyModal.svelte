<script>
	import Modal from '$ui/FlowbiteSvelte/modal/Modal.svelte';
	import MorphologyView from '$src/routes/morphology/[key]/MorphologyView.svelte';
	import { __morphologyModalVisible, __morphologyKey } from '$utils/stores';
	import { getModalTransition } from '$utils/getModalTransition';
	import { page } from '$app/stores';

	$: wordKeyData = {
		key: $__morphologyKey
	};

	$: if ($page.url.href) __morphologyModalVisible.set(false);
</script>

<Modal
	bind:open={$__morphologyModalVisible}
	title="Word {$__morphologyKey}"
	transitionParams={getModalTransition('bottom')}
	id="morphologyModal"
	size="xl"
	class="!rounded-b-none md:!rounded-3xl"
	bodyClass="p-6 space-y-4 flex-1 overflow-y-hidden overscroll-contain border {window.theme('border')}"
	headerClass="flex justify-between items-center p-6 rounded-t-3xl"
	dialogClass="fixed top-0 start-0 end-0 h-[-webkit-fill-available] md:inset-0 md:h-full z-50 w-full p-4 flex"
	position="bottom"
	center
	outsideclose
>
	<div class="flex flex-col space-y-4 text-sm pb-8 max-h-[80vh] overflow-y-scroll pr-2">
		<MorphologyView data={wordKeyData} />
	</div>
</Modal>
