<script>
	import PageHead from '$components/PageHead.svelte';
	import { websiteTagline } from '$data/websiteSettings';
	import { __currentPage } from '$utils/stores';
	import Logo from '$svgs/Logo.svelte';
	import HomepageTabs from '$ui/HomepageTabs.svelte';

	// icons
	import Supplication from '$svgs/Supplication.svelte';
	import Morphology from '$svgs/Morphology.svelte';
	import Search from '$svgs/Search.svelte';

	const homepageLinks = {
		1: {
			title: 'Supplications',
			icon: Supplication,
			link: '/supplications'
		},
		3: {
			title: 'Morphology',
			icon: Morphology,
			link: '/morphology/1:1'
		},
		4: {
			title: 'Search',
			icon: Search,
			link: '/search'
		}
	};

	__currentPage.set('home');
</script>

<PageHead title={`Quran ${websiteTagline}`} />

<div class="max-w-4xl mx-auto flex flex-col space-y-8 md:px-4 theme-grayscale">
	<div class="flex flex-col mt-4">
		<a href="/" class="flex justify-center" aria-label="Home">
			<Logo width="52" />
		</a>
		<div class="text-xs text-center opacity-70">{websiteTagline}</div>
	</div>

	<div class="w-full flex flex-col justify-center mt-12 text-xs space-y-8 scale-[0.85]">
		<div class="flex flex-row space-x-4 justify-center">
			{#each Object.entries(homepageLinks) as [id, link]}
				<a href={link.link} class="min-w-28 border border-gray-200 transition text-sm bg-gray-100 rounded-3xl p-5 hover:cursor-pointer hover:bg-lightGray">
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
