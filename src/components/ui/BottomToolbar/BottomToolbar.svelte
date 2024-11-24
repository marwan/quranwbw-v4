<script>
	import BottomToolbarButtons from '$ui/BottomToolbar/BottomToolbarButtons.svelte';
	import { __currentPage, __bottomToolbarVisible } from '$utils/stores';
</script>

<div id="bottom-toolbar" class="print:hidden {['chapter', 'page'].includes($__currentPage) ? 'block' : 'hidden'}">
	<div class="fixed z-20 w-full h-16 max-w-xs md:max-w-lg shadow-sm -translate-x-1/2 bg-white border border-black/10 rounded-full bottom-4 left-1/2 theme {$__bottomToolbarVisible ? 'block' : 'hidden'}">
		<div class="grid h-full max-w-lg grid-cols-5 mx-auto">
			<BottomToolbarButtons />
		</div>
	</div>
</div>
