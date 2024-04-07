let settingsDrawerOpen = false;
let tajweedModalOpen = false;

// check for key presses
window.addEventListener(
  "keydown",
  (event) => {
    try {
      document.getElementById("settings-drawer-close-button").click();
      document.getElementById("tajweed-modal-close-button").click();
    } catch (error) {}

    // key 'S' for settings drawer
    if (event.code === "KeyS") {
      if (settingsDrawerOpen === false) {
        document.getElementById("settings-drawer-button").click();
        settingsDrawerOpen = true;
      } else {
        document.getElementById("settings-drawer-close-button").click();
        settingsDrawerOpen = false;
      }
    }

    // key 'T' for tajweed modal
    if (event.code === "KeyT") {
      if (tajweedModalOpen === false) {
        document.getElementById("tajweed-modal-button").click();
        tajweedModalOpen = true;
      } else {
        document.getElementById("tajweed-modal-close-button").click();
        tajweedModalOpen = false;
      }
    }
  },
  true
);
