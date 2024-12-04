<script>
	import Modal from '$ui/FlowbiteSvelte/modal/Modal.svelte';
	import Spinner from '$svgs/Spinner.svelte';
	import { __websiteTheme, __tajweedRulesModalVisible, __currentPage, __chapterNumber } from '$utils/stores';
	import { term } from '$utils/terminologies';
	import { getModalTransition } from '$utils/getModalTransition';
	import { apiEndpoint, errorLoadingDataMessage } from '$data/websiteSettings';
	import { linkClasses } from '$data/commonClasses';

	const modalTitle = `${term('tajweed')} Rules`;
	let tajweedRulesData;

	$: if ($__currentPage || $__chapterNumber) __tajweedRulesModalVisible.set(false);

	$: {
		if ($__tajweedRulesModalVisible) {
			tajweedRulesData = (async () => {
				const response = await fetch(`${apiEndpoint}/tajweed-rules?version=3`);
				const data = await response.json();
				return data.data;
			})();
		}
	}

	// Take an input of a string with keys (eg: "2:27:7, 2:17:9") and convert each key to a hyperlink
	function replaceKeysWithLinks(keys) {
		const keysSplit = keys.split(', ');
		const keysLinks = [];

		for (let i = 0; i <= keysSplit.length - 1; i++) {
			keysLinks.push(`<a class='${linkClasses}' href='/${keysSplit[i].split(':')[0]}/${keysSplit[i].split(':')[1]}'>${keysSplit[i]}</a>`);
		}

		return keysLinks.join(', ');
	}
</script>

<Modal title={modalTitle} bind:open={$__tajweedRulesModalVisible} transitionParams={getModalTransition('bottom')} class="!rounded-b-none md:!rounded-3xl" bodyClass="p-6 space-y-4 flex-1 overflow-y-auto overscroll-contain" headerClass="flex justify-between items-center p-6 rounded-t-3xl text-black theme-grayyyscale" position="bottom" center outsideclose>
	<table class="w-full text-sm text-left rtl:text-right">
		<thead class="text-xs text-black text-grayyy-700 uppercase bg-lightGrayyy theme-grayyyscale">
			<tr>
				<th scope="col" class="px-6 py-3 w-fit"> Icon </th>
				<th scope="col" class="pl-2 pr-6 py-3"> Description </th>
			</tr>
		</thead>
		<tbody>
			{#await tajweedRulesData}
				<Spinner size={10} />
			{:then tajweedRulesData}
				{#each Object.entries(tajweedRulesData) as [key, value]}
					<tr class="{window.theme('background')} border-b {window.theme('border')} hover:bg-grayyy-50">
						<td class="py-4 w-fit tajweed-rules text-2xl text-center align-top theme-palette-tajweed font-filter"> {value.code} </td>
						<td class="pl-2 pr-6 py-4 theme-grayyyscale">
							<div class="flex flex-col space-y-2">
								<span class="font-bold">{value.title} </span>

								{#if value.description !== null}
									<span>{@html value.description.replace(/\r\n/g, '<br/>')}</span>
								{/if}

								{#if value.examples !== null}
									<span>Examples: {@html replaceKeysWithLinks(value.examples)}</span>
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

	<!-- links to PDF files -->
	<div class="mt-4 text-xs">
		To learn the correct pronunciation of Arabic alphabets, please refer to
		<a class={linkClasses} target="_blank" rel="noreferrer" href="https://static.quranwbw.com/data/v4/tajweed/Makharij%20Al%20Huroof.pdf">Makharij Al Huroof</a>.
	</div>
</Modal>
