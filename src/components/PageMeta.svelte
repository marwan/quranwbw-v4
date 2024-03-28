<script>
  export let title;

  import { websiteTagline, websiteTitle, websiteURL } from "$data/websiteSettings";

  // detect URL change and update it in meta
  let pageURL,
    previousUrl = "";
  const observer = new MutationObserver(function (mutations) {
    if (location.href !== previousUrl) {
      previousUrl = location.href;
      pageURL = location.href;
    }
  });
  const config = { subtree: true, childList: true };
  observer.observe(document, config);
</script>

<svelte:head>
  <title>{title} - {websiteURL}</title>
  <meta name="description" content="{title} - {websiteTagline} - {websiteURL}" />
  <meta name="og:site_name" content={websiteTitle} />
  <meta name="og:title" content="{title} - {websiteTagline} - {websiteURL}" />
  <meta name="og:image" content="" />
  <meta name="og:url" content={pageURL} />
</svelte:head>
