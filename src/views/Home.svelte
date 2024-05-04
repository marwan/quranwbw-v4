<script>
	import PageMeta from '$components/PageMeta.svelte';
	import { quranMetaData } from '$data/quranMeta';
	import { Link } from 'svelte-routing';
	import { websiteTagline } from '$data/websiteSettings';
	import { __currentPage, __lastRead } from '$utils/stores';
	import Logo from '$svgs/Logo.svelte';
	import HomepageTabs from '$ui/HomepageTabs.svelte';

	$: lastReadChapter = $__lastRead.split(':')[0];
	$: lastReadVerse = $__lastRead.split(':')[1];

	const linkStyles = 'text-xs font-normal';
	const cardInnerStyle = 'w-28 flex flex-col items-center justify-center border space-y-2 border-gray-200 transition text-sm bg-gray-50 rounded-3xl p-5 hover:cursor-pointer hover:bg-[#ebebeb]';
	const cardIconStyles = 'text-md md:text-xl';

	const homepageLinks = {
		1: {
			title: 'Supplications',
			icon: '🤲',
			link: '/supplications'
		},
		2: {
			title: 'Bookmarks',
			icon: '📘',
			link: '/bookmarks'
		},
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

	<div class="flex flex-wrap flex-col md:flex-col mt-12 justify-center text-xs text-gray-400 space-y-8">
		<!-- last read link -->
		<div id="last-read" class="flex justify-center items-center block pt-4">
			<Link to="/{lastReadChapter}/{lastReadVerse}" class={linkStyles}>Continue Reading: {quranMetaData[lastReadChapter].transliteration}, {lastReadChapter}:{lastReadVerse} {@html '&#10230'}</Link>
		</div>

		<!-- homepage links -->
		<div class="w-fit mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 justify-items-center">
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
