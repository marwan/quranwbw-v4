<script>
	import PageMeta from '$components/PageMeta.svelte';
	import { Link } from 'svelte-routing';
	import { websiteTagline } from '$data/websiteSettings';
	import { __currentPage } from '$utils/stores';
	import Logo from '$svgs/Logo.svelte';
	import HomepageTabs from '$ui/HomepageTabs.svelte';

	const homepageLinks = {
		1: {
			title: 'Supplications',
			icon: '🤲',
			link: '/supplications'
		},
		// 2: {
		// 	title: 'Bookmarks',
		// 	icon: '📘',
		// 	link: '/bookmarks'
		// },
		3: {
			title: 'Morphology',
			icon: '🧬',
			link: '/morphology/1:1'
		},
		4: {
			title: 'Search',
			icon: '🔎',
			link: '/search'
		}
	};

	const linkStyles = 'text-xs font-normal';
	const cardInnerStyle = 'min-w-28 flex flex-col items-center justify-center border space-y-2 border-gray-200 transition text-sm bg-gray-50 rounded-3xl p-5 hover:cursor-pointer hover:bg-[#ebebeb]';
	const cardIconStyles = 'text-sm md:text-lg';

	__currentPage.set('home');
</script>

<PageMeta title={`Quran ${websiteTagline}`} />

<div class="max-w-4xl mx-auto flex flex-col space-y-8 md:px-4 theme-grayscale">
	<div class="flex flex-col mt-4">
		<Link to="/" class="flex justify-center text-gray-500">
			<Logo width="52" />
		</Link>
		<div class="text-xs text-center text-gray-400">{websiteTagline}</div>
	</div>

	<div class="w-full flex flex-col justify-center mt-12 text-xs text-gray-400 space-y-8 scale-[0.80]">
		<div class="flex flex-row space-x-4 justify-center">
			{#each Object.entries(homepageLinks) as [id, link]}
				<Link to={link.link} class={cardInnerStyle}>
					<div class={cardIconStyles}>{link.icon}</div>
					<div class="{linkStyles} ">{link.title}</div>
				</Link>
			{/each}
		</div>
	</div>

	<!-- chapter and most read tabs -->
	<HomepageTabs />
</div>
