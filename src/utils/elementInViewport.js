// function to check if an element is within X percentage of the user viewport
export function elementInViewport(el, percentVisible) {
  let rect = el.getBoundingClientRect(),
    windowHeight = document.documentElement.clientHeight;
  return !(Math.floor(100 - ((rect.top >= 0 ? 0 : rect.top) / +-rect.height) * 100) < percentVisible || Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) < percentVisible);
}
