<script>
	import Modal from '$ui/FlowbiteSvelte/modal/Modal.svelte';
	import { tajweedRulings } from '$data/tajweedRulings';
	import { __websiteTheme, __tajweedRulesModalVisible } from '$utils/stores';
	import { term } from '$utils/terminologies';
	import { getModalTransition } from '$utils/getModalTransition';

	const modalTitle = `${term('tajweed')} Rules`;
</script>

<Modal title={modalTitle} bind:open={$__tajweedRulesModalVisible} transitionParams={getModalTransition('bottom')} class="!rounded-b-none md:!rounded-3xl theme" bodyClass="p-6 space-y-4 flex-1 overflow-y-auto overscroll-contain" headerClass="flex justify-between items-center p-6 rounded-t-3xl text-black theme-grayscale" position="bottom" center outsideclose>
	<table class="w-full text-sm text-left rtl:text-right">
		<thead class="text-xs text-gray-700 uppercase bg-lightGray theme-grayscale">
			<tr>
				<th scope="col" class="px-6 py-3 w-fit"> Icon </th>
				<th scope="col" class="px-6 py-3"> Description </th>
			</tr>
		</thead>
		<tbody>
			{#each Object.entries(tajweedRulings) as [id, ruling]}
				<tr class="bg-white border-b hover:bg-gray-50">
					<td class="py-4 w-fit tajweed-rules text-2xl text-center theme-palette-tajweed font-filter"> {ruling.code} </td>
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
