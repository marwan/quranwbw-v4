<script>
	import Modal from '$ui/FlowbiteSvelte/modal/Modal.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { __websiteTheme, __tajweedRulesModalVisible } from '$utils/stores';
	import { term } from '$utils/terminologies';
	import { getModalTransition } from '$utils/getModalTransition';
	import { apiEndpoint, errorLoadingDataMessage } from '$data/websiteSettings';

	const modalTitle = `${term('tajweed')} Rules`;
	let tajweedRulesData;

	$: {
		if ($__tajweedRulesModalVisible) {
			tajweedRulesData = (async () => {
				const response = await fetch(`${apiEndpoint}/tajweed-rules?version=1`);
				const data = await response.json();
				return data.data;
			})();
		}
	}
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
			{#await tajweedRulesData}
				<Spinner height="screen" margin="-mt-20" />
			{:then tajweedRulesData}
				{#each Object.entries(tajweedRulesData) as [key, value]}
					<tr class="bg-white border-b hover:bg-gray-50">
						<td class="py-4 w-fit tajweed-rules text-2xl text-center theme-palette-tajweed font-filter"> {value.code} </td>
						<td class="px-6 py-4 theme-grayscale">
							<div class="flex flex-col space-y-2">
								<span class="font-bold">{value.title} </span>

								{#if value.description !== null}
									<span>{@html value.description.replace(/\r\n/g, '<br/>')}</span>
								{/if}
							</div>
						</td>
					</tr>
				{/each}
			{:catch error}
				<p>{errorLoadingDataMessage}</p>
			{/await}
		</tbody>
	</table>
</Modal>
