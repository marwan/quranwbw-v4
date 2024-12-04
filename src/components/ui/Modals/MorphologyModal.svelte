<script>
	import Modal from '$ui/FlowbiteSvelte/modal/Modal.svelte';
	import MorphologyView from '$src/routes/morphology/[key]/MorphologyView.svelte';
	import { __morphologyModalVisible, __morphologyKey } from '$utils/stores';

	$: wordKeyData = {
		key: $__morphologyKey
	};
</script>

<Modal id="morphologyModal" bind:open={$__morphologyModalVisible} size="lg" class="rounded-3xl theme" bodyClass="p-6" dialogClass="fixed top-0 start-0 end-0 h-[-webkit-fill-available] md:inset-0 md:h-full z-50 w-full p-4 flex" center outsideclose>
	<div class="flex flex-col space-y-4 text-sm max-h-[80vh] overflow-y-scroll pr-2">
		<MorphologyView data={wordKeyData} />
	</div>
</Modal>
