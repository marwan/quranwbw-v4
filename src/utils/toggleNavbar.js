import { get } from "svelte/store";
import { __currentPage, __topNavbarVisible, __bottomNavbarVisible } from "$utils/stores";

let prevScrollpos = getCurrentScroll();
let ticking = false;

// function to toggle bottom navbar on scroll
export function toggleNavbar() {
  if (get(__currentPage) === "chapter") {
    let currentScrollPos = getCurrentScroll();

    if (!ticking) {
      window.requestAnimationFrame(function () {
        // scrolling up
        if (prevScrollpos > currentScrollPos) {
          __topNavbarVisible.set(true);
          __bottomNavbarVisible.set(true);
        }

        // scrolling down
        else {
          __topNavbarVisible.set(false);
          __bottomNavbarVisible.set(false);
        }

        prevScrollpos = currentScrollPos;
        ticking = false;
      });

      ticking = true;
    }
  }
}

function getCurrentScroll() {
  return window.pageYOffset || document.documentElement.scrollTop;
}
