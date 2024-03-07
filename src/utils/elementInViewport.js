// function to check if an element is within X percentage of the user viewport
export function elementInViewport(el, percentVisible) {
  let rect = el.getBoundingClientRect(),
    windowHeight = document.documentElement.clientHeight;
  return !(Math.floor(100 - ((rect.top >= 0 ? 0 : rect.top) / +-rect.height) * 100) < percentVisible || Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) < percentVisible);
}

export function elementIsVisibleInViewport(el, partiallyVisible = false) {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return partiallyVisible ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) && ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth)) : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
}
