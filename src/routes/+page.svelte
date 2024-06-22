<script>
	import PageHead from '$misc/PageHead.svelte';
	import HomepageTabs from '$ui/HomepageTabs.svelte';
	import Logo from '$svgs/Logo.svelte';
	import Quran from '$svgs/Quran.svelte';
	import Supplication from '$svgs/Supplication.svelte';
	import Morphology from '$svgs/Morphology.svelte';
	import SearchEmoji from '$svgs/SearchEmoji.svelte';
	import Book from '$svgs/Book.svelte';
	import { websiteTagline } from '$data/websiteSettings';
	import { __currentPage, __lastRead } from '$utils/stores';
	import { term } from '$utils/terminologies';

	const homepageLinks = [
		{
			title: term('supplications'),
			icon: Supplication,
			link: `/${term('supplications').toLowerCase()}`
		},
		{
			title: 'Mushaf',
			icon: Book,
			link: $__lastRead.hasOwnProperty('page') ? `/page/${$__lastRead.page}` : '/page/1'
		},
		{
			title: 'Morphology',
			icon: Morphology,
			link: '/morphology/1:1'
		},
		{
			title: 'Search',
			icon: SearchEmoji,
			link: '/search'
		}
	];

	__currentPage.set('home');
</script>

<PageHead title={`Quran ${websiteTagline}`} />

<div class="max-w-4xl mx-auto flex flex-col space-y-6 md:px-4 theme">
	<div class="flex flex-col mt-4 theme-grayscale">
		<a href="/" class="flex flex-col items-center justify-center" aria-label="Home">
			<Quran size={100} />
			<Logo />
		</a>
		<!-- <div class="text-xs text-center opacity-70">{websiteTagline}</div> -->
		<div class="text-xs text-center opacity-70">Word By Word & Morphology</div>
	</div>

	<div class="w-full flex flex-col md:justify-center text-xs space-y-8 scale-[0.66] md:scale-[0.85] theme-grayscale">
		<div class="flex flex-row space-x-4 justify-center">
			{#each Object.entries(homepageLinks) as [id, link]}
				<a href={link.link} class="min-w-28 border border-black/10 transition text-sm bg-gray-100 rounded-3xl p-5 hover:cursor-pointer hover:bg-lightGray">
					<div class="flex flex-col items-center justify-center space-y-2">
						<div class="text-sm md:text-lg opacity-70">
							<svelte:component this={link.icon} size={7} />
						</div>
						<div class="text-sm font-normal">{link.title}</div>
					</div>
				</a>
			{/each}
		</div>
	</div>

	<!-- chapter and most read tabs -->
	<HomepageTabs />
</div>
