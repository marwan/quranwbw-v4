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

	const linkStyles = 'text-xs font-normal';
	const cardInnerStyle = 'min-w-28 flex flex-col items-center justify-center border space-y-2 border-gray-200 transition text-sm bg-gray-50 rounded-3xl p-5 hover:cursor-pointer hover:bg-lightGray';
	const cardIconStyles = 'text-sm md:text-lg';

	__currentPage.set('home');
</script>

<PageHead title={`Quran ${websiteTagline}`} />

<div class="max-w-4xl mx-auto flex flex-col space-y-8 md:px-4 theme-grayscale">
	<div class="flex flex-col mt-4">
		<a href="/" class="flex justify-center">
			<Logo width="52" />
		</a>
		<div class="text-xs text-center text-gray-400">{websiteTagline}</div>
	</div>

	<div class="w-full flex flex-col justify-center mt-12 text-xs text-gray-400 space-y-8 scale-[0.80]">
		<div class="flex flex-row space-x-4 justify-center">
			{#each Object.entries(homepageLinks) as [id, link]}
				<a href={link.link} class={cardInnerStyle}>
					<div class={cardIconStyles}>
						<svelte:component this={link.icon} size={7} />
					</div>
					<div class="{linkStyles} ">{link.title}</div>
				</a>
			{/each}
		</div>
	</div>

	<!-- chapter and most read tabs -->
	<HomepageTabs />
</div>
