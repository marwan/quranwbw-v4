import { userSettingsStore } from "../lib/stores";

// function to add/remove a bookmark
export function updateBookmarks(event) {
  let userSettings = JSON.parse(localStorage.getItem("userSettings"));
  let userBookmarks = userSettings["userBookmarks"];
  let key = event.target.dataset.key;

  if (userBookmarks.includes(key)) {
    userBookmarks = userBookmarks.filter((x) => x !== key);
  } else {
    userBookmarks.push(key);
  }

  // update the settings in localStorage and in store
  userSettings["userBookmarks"] = userBookmarks;
  userSettingsStore.set(JSON.stringify(userSettings));
  localStorage.setItem("userSettings", JSON.stringify(userSettings));
}
