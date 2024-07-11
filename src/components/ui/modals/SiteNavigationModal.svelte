<script>
	import Modal from '$ui/flowbite-svelte/modal/Modal.svelte';
	import Menu from '$svgs/Menu.svelte';
	import Settings from '$svgs/Settings.svelte';
	import { __siteNavigationModalVisible } from '$utils/stores';

	const linkClasses = 'w-28 flex flex-col space-y-2 py-4 px-1 bg-gray-100 hover:bg-gray-200 rounded-full justify-center items-center cursor-pointer';
</script>

<Modal id="siteNavigationModal" bind:open={$__siteNavigationModalVisible} size="xs" class="rounded-3xl theme" bodyClass="p-6" center outsideclose>
	<div class="flex flex-col space-y-4">
		<!-- modals / popups -->
		<div class="flex flex-col space-y-2">
			<div class="font-semibold">Modals</div>
			<div class="grid grid-cols-3 gap-1">
				{#each { length: 2 } as _, link}
					<!-- link card -->
					<div class={linkClasses}>
						<Settings size={4} />
						<div class="text-sm">Setting {link}</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- internal links / pages -->
		<div class="flex flex-col space-y-2">
			<div class="font-semibold">Pages</div>
			<div class="grid grid-cols-3 gap-2">
				{#each { length: 7 } as _, link}
					<!-- link card -->
					<div class={linkClasses}>
						<Menu size={4} />
						<div class="text-sm">Setting {link}</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- external links -->
		<div class="flex flex-col space-y-2">
			<div class="font-semibold">External Links</div>
			<div class="grid grid-cols-3 gap-2">
				{#each { length: 1 } as _, link}
					<!-- link card -->
					<div class={linkClasses}>
						<Menu size={4} />
						<div class="text-sm">Setting {link}</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</Modal>
