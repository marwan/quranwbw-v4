<script>
	import Modal from '$ui/flowbite-svelte/modal/Modal.svelte';
	import { tajweedRulings } from '$data/quranMeta';
	import { __websiteTheme, __tajweedRulesModalVisible } from '$utils/stores';
</script>

<Modal title="Tajweed Rules" id="tajeedRulesModal" bind:open={$__tajweedRulesModalVisible} class="rounded-3xl theme" bodyClass="p-6 space-y-4 flex-1 overflow-y-auto overscroll-contain" headerClass="flex justify-between items-center p-6 rounded-t-3xl text-black theme-grayscale" center outsideclose>
	<table class="w-full text-sm text-left rtl:text-right">
		<thead class="text-xs text-gray-700 uppercase bg-lightGray theme-grayscale">
			<tr>
				<th scope="col" class="px-6 py-3"> Icon/Color </th>
				<th scope="col" class="px-6 py-3"> Description </th>
			</tr>
		</thead>
		<tbody>
			{#each Object.entries(tajweedRulings) as [id, ruling]}
				<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-lightGray">
					<td class="px-6 py-4 tajweed-rules text-2xl theme-palette-tajweed font-filter"> {ruling.code} </td>
					<td class="px-6 py-4 theme-grayscale">
						<div class="flex flex-col space-y-2">
							<span class="font-bold">{ruling.title} </span>

							{#if ruling.description !== null}
								<span>{@html ruling.description}</span>
							{/if}

							{#if ruling.points}
								<ul class="list-disc ml-5 space-y-2">
									{#each Object.entries(ruling.points) as [id, point]}
										<li>{@html point.description}</li>
									{/each}
								</ul>
							{/if}
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</Modal>
