<script>
	export let data;
	export let startVerse = null;
	export let endVerse = null;

	import Chapter from '$views/Chapter.svelte';
</script>

<Chapter {data} {startVerse} {endVerse} />
