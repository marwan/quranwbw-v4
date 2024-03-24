// function to execute function with a delay for scroll events
export function debounce(method, delay) {
  clearTimeout(method._tId);
  method._tId = setTimeout(function () {
    method();
  }, delay);
}
