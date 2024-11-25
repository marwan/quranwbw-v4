<script>
	import PageHead from '$misc/PageHead.svelte';
	import HomepageTabs from '$ui/HomepageTabs.svelte';
	import Logo from '$svgs/Logo.svelte';
	import Quran from '$svgs/Quran.svelte';
	import { websiteTagline } from '$data/websiteSettings';
	import { __currentPage, __lastRead } from '$utils/stores';

	__currentPage.set('home');
</script>

<PageHead title={`Quran ${websiteTagline}`} />

<div class="max-w-4xl mx-auto flex flex-col space-y-6 md:px-4 theme">
	<div class="flex flex-col mt-4 mb-4 theme-grayscale">
		<a href="/" class="flex flex-col items-center justify-center" aria-label="Home">
			<Quran size={100} />
			<Logo />
		</a>
		<!-- <div class="text-xs text-center opacity-70">{websiteTagline}</div> -->
		<div class="text-xs text-center opacity-70">Word By Word & Morphology</div>
	</div>

	<!-- chapter and most read tabs -->
	<HomepageTabs />
</div>
