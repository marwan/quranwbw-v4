import { supplicationsFromQuran } from "$data/quranMeta";

// function to a get string of all supplications chapter:verses
export function getSupplicationKeys() {
  let array = [];

  for (const [key] of Object.entries(supplicationsFromQuran)) {
    array.push(key);
  }

  return array.toString();
}
