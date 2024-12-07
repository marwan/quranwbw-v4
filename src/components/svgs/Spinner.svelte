<script>
	export let size = '20',
		height = 'fit',
		margin = '';
</script>

<div class="flex m-auto h-{height} {margin} justify-center items-center">
	<svg class="animate-spin w-{size} h-{size}" fill="none" viewBox="0 0 32 32">
		<path clip-rule="evenodd" d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z" fill={window.theme('icon')} fill-rule="evenodd" />
	</svg>
</div>
<div class="hidden h-screen w-20 h-20"></div>
