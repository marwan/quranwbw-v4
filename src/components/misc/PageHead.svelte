<script>
	export let title;

	import { websiteTagline, websiteTitle, websiteURL, wbwLanguages } from '$data/websiteSettings';
	import { __currentPage } from '$utils/stores';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{title} - {websiteURL}</title>
	<meta name="description" content="{title} - {websiteTagline} in {wbwLanguages} - {websiteURL}" />
	<meta name="og:site_name" content={websiteTitle} />
	<meta name="og:title" content="{title} - {websiteTagline} in {wbwLanguages} - {websiteURL}" />
	<meta name="og:image" content="" />
	<meta name="og:url" content={$page.url.href} />

	<!-- disable pinch zoom on mushaf page -->
	{#if $__currentPage === 'page'}
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	{/if}
</svelte:head>
