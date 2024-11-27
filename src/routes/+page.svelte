<script>
	import PageHead from '$misc/PageHead.svelte';
	import HomepageTabs from '$ui/HomepageTabs.svelte';
	import Logo from '$svgs/Logo.svelte';
	import Quran from '$svgs/Quran.svelte';
	import Megaphone from '$svgs/Megaphone.svelte';
	import Banner from '$ui/FlowbiteSvelte/banner/Banner.svelte';
	import { websiteTagline } from '$data/websiteSettings';
	import { __currentPage, __lastRead, __newSiteChangelogModalVisible } from '$utils/stores';

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

<!-- banner for updates: currently v4 launch -->
<Banner id="newSiteBanner" position="fixed" divClass="z-10 flex justify-between p-4 !bg-gray-100 theme">
	<p class="flex items-center text-sm font-normal text-gray-500 space-x-1">
		<span class="inline-flex p-2 bg-gray-200 rounded-full text-black">
			<span class="opacity-70"><Megaphone size={3} /></span>
			<span class="sr-only">Announcement</span>
		</span>

		<span class="text-black text-xs md:text-sm">
			Experience the Enhanced QuranWBW. <button class="inline font-medium text-primary-600 underline underline-offset-2 decoration-600 decoration-solid hover:no-underline" on:click={() => __newSiteChangelogModalVisible.set(true)}> Read More {@html '&#x2192;'}</button>.
		</span>
	</p>
</Banner>
