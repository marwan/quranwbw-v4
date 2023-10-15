<script>
  import "./lib/userSettings";
  import { Router, Link, Route } from "svelte-routing";
  import ChaptersList from "./components/ChaptersList.svelte";
  import SingleChapter from "./components/SingleChapter.svelte";
  import Supplications from "./components/Supplications.svelte";
  import Bookmarks from "./components/Bookmarks.svelte";
</script>

<Router>
  <div class="max-w-screen-lg mx-auto space-y-8 px-6 py-12">
    <nav class="flex flex-row space-x-8">
      <Link to="/">Home</Link>
      <Link to="/supplications">Supplications</Link>
      <Link to="/bookmarks">Bookmarks</Link>
    </nav>

    <!-- components will be rendered in this div -->
    <div>
      <Route path="/" component={ChaptersList} />
      <Route path="/supplications" component={Supplications} />
      <Route path="/bookmarks" component={Bookmarks} />

      <!-- different combinations of chapter routes -->
      <!-- Example 1: "/1" (chapter 1) -->
      <Route path="/:chapter" let:params>
        <SingleChapter chapter={params.chapter} />
      </Route>
      <!-- Example 2: "/2/255" (chapter 2, verse 255) -->
      <Route path="/:chapter/:startVerse" let:params>
        <SingleChapter chapter={params.chapter} startVerse={params.startVerse} />
      </Route>
      <!-- Example 3: "/2/285-286" (chapter 2, verse 285 to verse 286) -->
      <Route path="/:chapter/:startVerse-:endVerse" let:params>
        <SingleChapter chapter={params.chapter} startVerse={params.startVerse} endVerse={params.endVerse} />
      </Route>
    </div>
  </div>
</Router>
