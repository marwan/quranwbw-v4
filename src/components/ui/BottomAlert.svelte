<script>
	import { __bottomNavbarVisible } from '$utils/stores';
	import { showBottomAlert } from '$utils/bottomAlertController';
</script>

<div class="bg-gray-200 w-full flex justify-center items-center relative z-[51]">
	<div id="bottom-alert" class="hidden flex items-center fixed bottom-0 {$__bottomNavbarVisible ? 'mb-24' : 'mb-4'} border p-4 mx-4 text-sm text-gray-800 bg-[#ebebeb] rounded-3xl theme-grayscale" role="alert">
		<svg class="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
			<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
		</svg>
		<span class="sr-only">Info</span>
		<div id="bottom-alert-message"></div>
	</div>
</div>
