<script>
  import "./utils/userSettings";
  import { userSettingsStore } from "./utils/stores";
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./views/Home.svelte";
  import Chapter from "./views/Chapter.svelte";
  import Supplications from "./views/Supplications.svelte";
  import Bookmarks from "./views/Bookmarks.svelte";

  $: userBookmarksCount = JSON.parse($userSettingsStore)["userBookmarks"].length;
</script>

<Router>
  <div class="max-w-screen-lg mx-auto space-y-8 px-4 py-12">
    <nav class="flex flex-row justify-center space-x-4 text-sm md:text-md md:space-x-8">
      <Link to="/">Home</Link>
      <Link to="/supplications">Supplications</Link>
      <Link to="/bookmarks">Bookmarks ({userBookmarksCount})</Link>
    </nav>

    <!-- components will be rendered in this div -->
    <div>
      <Route path="/" component={Home} />
      <Route path="/supplications" component={Supplications} />
      <Route path="/bookmarks" component={Bookmarks} />

      <Route path="/:chapter/*" let:params>
        <Chapter chapter={params.chapter} />
      </Route>

      <!-- different combinations of chapter routes -->
      <!-- Example 1: "/1" (chapter 1) -->
      <!-- <Route path="/:chapter" let:params>
        <SingleChapter chapter={params.chapter} />
      </Route> -->
      <!-- Example 2: "/2/255" (chapter 2, verse 255) -->
      <!-- <Route path="/:chapter/:startVerse" let:params>
        <SingleChapter chapter={params.chapter} startVerse={params.startVerse} />
      </Route> -->
      <!-- Example 3: "/2/285-286" (chapter 2, verse 285 to verse 286) -->
      <!-- <Route path="/:chapter/:startVerse-:endVerse" let:params>
        <SingleChapter chapter={params.chapter} startVerse={params.startVerse} endVerse={params.endVerse} />
      </Route> -->
    </div>
  </div>
</Router>
