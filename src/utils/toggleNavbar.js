import { get } from "svelte/store";
import { currentPageStore, topNavbarVisibleStore, bottomNavbarVisibleStore } from "$utils/stores";

let lastScrollTop = 0;

// function to toggle bottom navbar on scroll
export function toggleNavbar() {
  // only toggle the bottom navbar for chapter page
  if (get(currentPageStore) === "chapter") {
    // or window.addEventListener("scroll"....
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // scrolling down
    if (scrollTop > lastScrollTop) {
      topNavbarVisibleStore.set(false);
    }

    // scrolling up
    else if (scrollTop < lastScrollTop) {
      topNavbarVisibleStore.set(true);
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
  }
}
