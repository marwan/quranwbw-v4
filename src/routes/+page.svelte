<script>
	import PageHead from '$misc/PageHead.svelte';
	import HomepageTabs from '$ui/HomepageTabs.svelte';
	import Logo from '$svgs/Logo.svelte';
	import Quran from '$svgs/Quran.svelte';
	import Megaphone from '$svgs/Megaphone.svelte';
	import Banner from '$ui/FlowbiteSvelte/banner/Banner.svelte';
	import { websiteTagline } from '$data/websiteSettings';
	import { __currentPage, __lastRead, __newSiteChangelogModalVisible } from '$utils/stores';
	import { linkClasses } from '$data/commonClasses';

	__currentPage.set('home');
</script>

<PageHead title={`Quran ${websiteTagline}`} />

<div class="max-w-4xl mx-auto flex flex-col space-y-6 md:px-4">
	<div class="flex flex-col mt-8 mb-4">
		<a href="/" class="flex flex-row space-x-1 items-center justify-center" style="color: {window.theme('icon')}" aria-label="Home">
			<div><Quran size={50} /></div>
			<div class="flex flex-col">
				<Logo />
				<div class="text-xs text-center opacityyy-70">Word By Word & Morphology</div>
			</div>
		</a>
	</div>

	<!-- chapter and most read tabs -->
	<HomepageTabs />
</div>

<!-- banner for website updates: currently v4 launch -->
<Banner id="newSiteBanner" position="absolute" divClass="z-10 flex justify-between p-4">
	<p class="flex items-center text-sm font-normal text-grayyy-500 space-x-1 truncate">
		<span class="inline-flex p-2 rounded-full border {window.theme('border')}">
			<span class="opacityyy-70"><Megaphone size={3} /></span>
			<span class="sr-only">Announcement</span>
		</span>

		<span class="text-xs md:text-sm">
			Introducing QuranWBW v4.0. <button class={linkClasses} on:click={() => __newSiteChangelogModalVisible.set(true)}> See What's New {@html '&#x2192;'}</button>
		</span>
	</p>
</Banner>
