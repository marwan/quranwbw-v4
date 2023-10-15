// default user settings
const defaultLocalSettings = {
  userBookmarks: [], // no bookmarks by default,
};

// setting default user settings in localStorage
(async function () {
  let userSettings = localStorage.getItem("userSettings");
  if (userSettings === undefined || userSettings === null || userSettings === "") {
    localStorage.setItem("userSettings", JSON.stringify(defaultLocalSettings));
  }
})();
