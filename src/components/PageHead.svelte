<script>
	export let title;

	import { websiteTagline, websiteTitle, websiteURL, wbwLanguages } from '$data/websiteSettings';
	import { __wordType } from '$utils/stores';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{title} - {websiteURL}</title>
	<meta name="description" content="{title} - {websiteTagline} in {wbwLanguages} - {websiteURL}" />
	<meta name="og:site_name" content={websiteTitle} />
	<meta name="og:title" content="{title} - {websiteTagline} in {wbwLanguages} - {websiteURL}" />
	<meta name="og:image" content="" />
	<meta name="og:url" content={$page.url.href} />

	<!-- include the mushaf fonts css file for v4 font type -->
	{#if $__wordType === 2}
		<link rel="stylesheet" href="/css/mushaf.css" />
	{/if}
</svelte:head>
