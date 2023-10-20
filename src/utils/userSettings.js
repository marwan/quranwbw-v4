// default user settings
const defaultLocalSettings = {
  displaySettings: {
    displayType: 1, // normal
    wordType: 1, // uthmani
  },
  userBookmarks: [], // no bookmarks by default,
};

// setting default user settings in localStorage
(async function () {
  const userSettings = localStorage.getItem("userSettings");
  if (userSettings === undefined || userSettings === null || userSettings === "") {
    localStorage.setItem("userSettings", JSON.stringify(defaultLocalSettings));
  }
})();
