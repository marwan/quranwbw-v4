<script>
  import { userSettingsStore } from "../utils/stores";
  import { Link } from "svelte-routing";

  $: userBookmarksCount = JSON.parse($userSettingsStore)["userBookmarks"].length;
</script>

<nav class="flex flex-row justify-center space-x-4 text-sm md:text-md md:space-x-8">
  <Link to="/">Home</Link>
  <Link to="/supplications">Supplications</Link>
  <Link to="/bookmarks">Bookmarks ({userBookmarksCount})</Link>
</nav>
