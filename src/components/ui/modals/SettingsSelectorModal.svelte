<script>
	import Modal from '$ui/flowbite-svelte/modal/Modal.svelte';
	import DisplayTypeSelector from '$ui/SettingsDrawer/DisplayTypeSelector.svelte';
	import { __settingsSelectorModal } from '$utils/stores';
	import { buttonClasses } from '$data/commonClasses';
</script>

<Modal id="settingsSelectorModal" bind:open={$__settingsSelectorModal.visible} size="xs" class="!rounded-b-none md:!rounded-3xl theme" bodyClass="p-6" position="bottom" center outsideclose>
	<!-- Modal content -->
	<h3 id="modal-title" class="mb-8 text-xl font-medium text-black">{$__settingsSelectorModal.title}</h3>
	<DisplayTypeSelector />

	<!-- <div class="flex flex-row space-x-2">
		<button class="w-full mt-6 {buttonClasses}" on:click={() => __settingsSelectorModal.set({ visible: false })}>Close</button>
	</div> -->
</Modal>
