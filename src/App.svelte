<script>
  import { Router, Route } from "svelte-routing";

  // Flowbite JS
  import "$lib/flowbite.min.js";

  // default user settings
  import "$utils/userSettings";

  import Home from "$views/Home.svelte";
  import Chapter from "$views/Chapter.svelte";
  import Supplications from "$views/Supplications.svelte";
  import Bookmarks from "$views/Bookmarks.svelte";
  import Navbar from "$ui/Navbar.svelte";
  import Drawer from "$ui/Drawer.svelte";
  import InitialSetupModal from "$modals/InitialSetupModal.svelte";
  import AudioModal from "$modals/AudioModal.svelte";
</script>

<Router>
  <div class="max-w-screen-lg mx-auto px-4 py-12">
    <!-- include the UI elements -->
    <Navbar />
    <Drawer />
    <InitialSetupModal />
    <AudioModal />

    <!-- components will be rendered in this div -->
    <div>
      <Route path="/" component={Home} />
      <Route path="/supplications" component={Supplications} />
      <Route path="/bookmarks" component={Bookmarks} />

      <Route path="/:chapter/*" let:params>
        <Chapter chapter={params.chapter} />
      </Route>
    </div>
  </div>
</Router>
