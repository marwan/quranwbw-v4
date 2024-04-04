<script>
  import { buttonElement, disabledElement } from "$utils/commonStyles";
  import { toggleModal } from "$utils/toggleModal";
  import { __userToken, __userSettings } from "$utils/stores";
  import { downloadTextFile } from "$utils/downloadTextFile";

  // icons
  import Download from "$svgs/Download.svelte";
  import CloudDownload from "$svgs/CloudDownload.svelte";
  import CloudUpload from "$svgs/CloudUpload.svelte";

  let tokenTab = 0,
    tokenGenerated = false,
    tokenGenerationInProcess = false,
    tokenValidationInProcess = false,
    settingsDownloadInProcess = false,
    settingsUploadInProcess = false,
    tokenMessageInfo;

  // validate the user provided token
  async function validateToken() {
    const token = document.getElementById("token-value").value;

    // basic checks
    if (token === "") return (tokenMessageInfo = "You have not entered anything.");
    if (token.length !== 50) return (tokenMessageInfo = "Invalid token length.");

    tokenValidationInProcess = true;
    tokenMessageInfo = "Validating your token, please wait...";

    const response = await fetch("https://api.quranwbw.com/v1/user/tokens/check", {
      method: "GET",
      headers: {
        "user-token": token,
      },
    });

    const tokenJSON = await response.json();

    // save the token
    if (tokenJSON.code === 200) {
      tokenMessageInfo = "Your token has been saved. Reloading the page...";
      saveToken(token);
      location.reload(); // reload the page
    }

    // limit token generation
    else if (tokenJSON.code === 429) tokenMessageInfo = "You have reached the limit of token validation. Try later.";
    // all other cases
    else tokenMessageInfo = "The token is not valid.";

    tokenValidationInProcess = false;
  }

  // generate a new token
  async function generateToken() {
    tokenGenerationInProcess = true;
    tokenMessageInfo = "Generating a token, please wait...";

    const response = await fetch("https://api.quranwbw.com/v1/user/tokens/generate", {
      method: "POST",
      headers: {
        "user-agent": navigator.userAgent,
        "Content-Type": "application/json",
      },
    });

    const tokenJSON = await response.json();

    if (tokenJSON.code === 200) {
      tokenGenerated = true;
      tokenMessageInfo = "A token has been generated and saved. Make sure to back it up.";
      saveToken(tokenJSON.data[0].user_token);
    }

    // limit token generation
    else if (tokenJSON.code === 429) tokenMessageInfo = "You have reached the limit of token generation. Try later.";
    // all other cases
    else tokenMessageInfo = "There was an error generating a token.";

    tokenGenerationInProcess = false;
  }

  // upload user settings to cloud
  async function uploadSettings() {
    settingsUploadInProcess = true;
    tokenMessageInfo = "Uploading your settings, please wait...";

    const response = await fetch("https://api.quranwbw.com/v1/user/settings", {
      method: "POST",
      headers: {
        "user-token": $__userToken,
        "Content-Type": "application/json",
      },
      body: $__userSettings,
    });

    const userSettings = await response.json();

    if (userSettings.code === 200) tokenMessageInfo = "Settings have been uploaded.";
    // all other cases
    else tokenMessageInfo = "There was an error while uploading your settings.";

    settingsUploadInProcess = false;
  }

  // download user settings from cloud
  async function downloadSettings() {
    settingsDownloadInProcess = true;
    tokenMessageInfo = "Downloading your settings, please wait...";

    const response = await fetch("https://api.quranwbw.com/v1/user/settings", {
      method: "GET",
      headers: {
        "user-token": $__userToken,
      },
    });

    const userSettings = await response.json();

    if (userSettings.code === 200) {
      tokenMessageInfo = "Settings have been downloaded. Reloading the page...";
      localStorage.setItem("userSettings", JSON.stringify(userSettings.data[0].user_settings));
      location.reload(); // reload the page
    }

    // when there's no settings
    else if (userSettings.code === 404) tokenMessageInfo = "No settings found in the cloud.";
    // all other cases
    else tokenMessageInfo = "There was an error while downloading your settings.";

    settingsDownloadInProcess = false;
  }

  // to save the token in localStorage and store
  function saveToken(token) {
    __userToken.set(token);
    localStorage.setItem("userToken", token);
  }

  // delete token
  function deleteToken() {
    localStorage.removeItem("userToken");
    __userToken.set(null);

    // collapse both tabs
    switchTabs(0);
  }

  // switch tabs and clear the message
  function switchTabs(tab) {
    tokenTab = tab;
    tokenMessageInfo = "";
    tokenGenerated = false;

    if (tab === 1) tokenMessageInfo = "Enter your token in the input box below to validate it.";
    else if (tab === 2) tokenMessageInfo = "Click the button below to generate your unique token.";
  }
</script>

<!-- token modal -->
<div id="token-modal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full text-sm p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full grayscale">
  <div class="relative w-full max-w-xl max-h-full">
    <!-- Modal content -->
    <div class="relative bg-white rounded-lg shadow daaark:bg-gray-700">
      <button type="button" on:click={() => toggleModal("token-modal", "hide")} class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center daaark:hover:bg-gray-600 daaark:hover:text-white" data-modal-hide="token-modal">
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
        <span class="sr-only">Close modal</span>
      </button>
      <div class="px-6 py-6 space-y-8 lg:px-8">
        <h3 id="token-modal-title" class="mb-8 text-xl font-medium text-gray-900 daaark:text-white">Token Login</h3>
        <div id="token-info" class="flex flex-col space-y-4 text-sm">
          <span>Token Login allows you to save your settings in the cloud without the need of creating an account or providing any personal details. This is done by assigning a unique token to your browser, and the same is used to sync your settings. If you do not opt for this, your settings will only be saved locally.</span>
          <span>Once you generate a token, you can use it in a different browser to sync your settings from the cloud. Just make sure to save your token because there is no way to get it back if you lose access to it.</span>
          <span>Note that your settings are not automatically synced. You have to do it manually everytime. While this may be tedious, it prevents unnecessary data loss and conflicts.</span>
        </div>

        <!-- tabs buttons -->
        {#if $__userToken === null}
          <div class="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            <button on:click={() => switchTabs(1)} class="w-full {buttonElement}">I have a token</button>
            <button on:click={() => switchTabs(2)} class="w-full {buttonElement}">I want a token</button>
          </div>
        {/if}

        <!-- just a border -->
        {#if $__userToken || tokenTab !== 0}
          <div class="border-t my-6"></div>
        {/if}

        <!-- token messages -->
        {#if tokenMessageInfo !== undefined && tokenMessageInfo !== ""}
          <div id="token-message" class="text-sm font-medium text-center">{tokenMessageInfo}</div>
        {/if}

        <!-- I already have a token -->
        {#if tokenTab === 1 && $__userToken === null}
          <div id="already-have-a-token" class="flex flex-col space-y-4 justify-center">
            <input id="token-value" type="text" class="rounded-md w-full text-center text-xs" placeholder="Enter your token here..." />
            <button id="validate-token" on:click={() => validateToken()} class="w-full {buttonElement} {tokenValidationInProcess === true && disabledElement}">
              <span>{tokenValidationInProcess === false ? "Validate Token" : "Validating token..."}</span>
            </button>
          </div>
        {/if}

        <!-- I want a new token -->
        {#if tokenTab === 2 && $__userToken === null}
          <div id="want-to-generate-token" class="flex flex-col justify-center">
            {#if tokenGenerated === false}
              <button id="generate-token" on:click={() => generateToken()} class="w-full {buttonElement} {tokenGenerationInProcess === true && disabledElement}">
                <span>{tokenGenerationInProcess === false ? "Generate Token" : "Generating token..."}</span>
              </button>
            {/if}
          </div>
        {/if}

        <!-- download token -->
        {#if $__userToken}
          <div class="flex flex-col space-y-6">
            <!-- input box and download button -->
            <div class="flex flex-row space-x-2">
              <input id="token-value" type="text" value={$__userToken} class="rounded-md w-full text-center text-xs" readonly="readonly" />
              <button id="download-token-file" on:click={() => downloadTextFile(`quranwbw-token-${$__userToken}`, $__userToken)} class="w-fit {buttonElement}">
                <Download />
              </button>
            </div>

            <div class="flex flex-col space-y-4">
              <!-- download / upload buttons -->
              <div class="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                <button id="upload-settings" on:click={() => uploadSettings()} class="w-full {buttonElement} {settingsUploadInProcess === true && disabledElement}">
                  <CloudUpload />
                  <span> {settingsUploadInProcess === false ? "Backup Settings To Cloud" : "Uploading settings..."} </span>
                </button>

                <button id="download-settings" on:click={() => downloadSettings()} class="w-full {buttonElement} {settingsDownloadInProcess === true && disabledElement}">
                  <CloudDownload />
                  <span> {settingsDownloadInProcess === false ? "Restore Settings From Cloud" : "Downloading settings..."} </span>
                </button>
              </div>

              <!-- delete token button -->
              <button id="delete-token" on:click={() => deleteToken()} class="w-full bg-gray-600 text-white hover:bg-gray-700 {buttonElement}">
                <span>Delete Token</span>
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
