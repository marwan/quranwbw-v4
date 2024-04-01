const fontURL = "https://tajweed.beta.quran.com/fonts/quran/hafs/v4/colrv1/woff2";

export function preloadMushafFonts(page) {
  // fetch previous two
  fetch(`${fontURL}/p${page - 1}.woff2`);
  fetch(`${fontURL}/p${page - 2}.woff2`);

  // fetch next two
  fetch(`${fontURL}/p${page + 1}.woff2`);
  fetch(`${fontURL}/p${page + 2}.woff2`);
}
