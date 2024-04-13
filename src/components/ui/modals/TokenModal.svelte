<script>
	import { buttonElement, disabledElement } from '$data/commonStyles';
	import { toggleModal } from '$utils/toggleModal';
	import { __userToken, __userSettings } from '$utils/stores';
	import { downloadTextFile } from '$utils/downloadTextFile';

	// icons
	import Download from '$svgs/Download.svelte';
	import Email from '$svgs/Email.svelte';
	import Share from '$svgs/Share.svelte';
	import CloudDownload from '$svgs/CloudDownload.svelte';
	import CloudUpload from '$svgs/CloudUpload.svelte';
	import Info from '$svgs/Info.svelte';
	import Cross from '$svgs/Cross.svelte';
	import Check from '$svgs/Check.svelte';
	import Cog from '$svgs/Cog.svelte';

	const userAPIEndpoint = 'https://api.quranwbw.com/v1/user';

	let tokenTab = 0,
		tokenGenerated = false,
		tokenGenerationInProcess = false,
		tokenValidationInProcess = false,
		settingsDownloadInProcess = false,
		settingsUploadInProcess = false,
		tokenEmailInProcess = false,
		tokenEmailed = false,
		tokenCloudButtonsVisible = true,
		tokenMessageText,
		tokenMessageType = 1;

	// message icons
	const messageTypeIcons = {
		1: { icon: Check }, // success
		2: { icon: Cross }, // error
		3: { icon: Info }, // warning
		4: { icon: Cog } // loading
	};

	// validate the token provided by user
	async function validateToken() {
		const token = document.getElementById('token-value').value;

		// basic checks
		if (token === '') return showMessage(3, 'You have not entered anything.');
		if (token.length !== 10) return showMessage(2, 'Invalid token length.');

		tokenValidationInProcess = true;
		showMessage(4, 'Validating your token, please wait...');

		const response = await fetch(`${userAPIEndpoint}/tokens/check`, {
			method: 'GET',
			headers: {
				'user-token': token
			}
		});

		const tokenJSON = await response.json();

		// save the token
		if (tokenJSON.code === 200) {
			showMessage(1, 'Your token has been saved. Reloading the page...');
			saveToken(token);
			location.reload(); // reload the page
		}

		// limit token generation
		else if (tokenJSON.code === 429) showMessage(2, 'You have reached the limit of token validation. Try later.');
		// all other cases
		else showMessage(2, 'The token is not valid.');

		tokenValidationInProcess = false;
	}

	// generate a new token for user
	async function generateToken() {
		tokenGenerationInProcess = true;
		showMessage(4, 'Generating a token, please wait...');

		const response = await fetch(`${userAPIEndpoint}/tokens/generate`, {
			method: 'POST',
			headers: {
				'user-agent': navigator.userAgent,
				'Content-Type': 'application/json'
			}
		});

		const responseJSON = await response.json();

		if (responseJSON.code === 200) {
			tokenGenerated = true;
			showMessage(1, 'A token has been generated and saved. Make sure to back it up.');
			saveToken(responseJSON.data[0].user_token);
		}

		// limit token generation
		else if (responseJSON.code === 429) showMessage(2, 'You have reached the limit of token generation. Try later.');
		// all other cases
		else showMessage(2, 'There was an error generating a token.');

		tokenGenerationInProcess = false;
	}

	// upload user's settings to cloud
	async function uploadSettings() {
		settingsUploadInProcess = true;
		showMessage(4, 'Uploading your settings, please wait...');

		const response = await fetch(`${userAPIEndpoint}/settings`, {
			method: 'POST',
			headers: {
				'user-token': $__userToken,
				'Content-Type': 'application/json'
			},
			body: $__userSettings
		});

		const responseJSON = await response.json();

		if (responseJSON.code === 200) showMessage(1, 'Settings have been uploaded.');
		// too many attempts
		// else if (responseJSON.code === 429) tokenMessageText = "Too many attempts. Please slow down.";
		// all other cases
		else showMessage(2, 'There was an error while uploading your settings.');

		settingsUploadInProcess = false;
	}

	// download user's settings from cloud
	async function downloadSettings() {
		settingsDownloadInProcess = true;
		showMessage(4, 'Downloading your settings, please wait...');

		const response = await fetch(`${userAPIEndpoint}/settings`, {
			method: 'GET',
			headers: {
				'user-token': $__userToken
			}
		});

		const responseJSON = await response.json();

		if (responseJSON.code === 200) {
			showMessage(1, 'Settings have been downloaded. Reloading the page...');
			localStorage.setItem('userSettings', JSON.stringify(responseJSON.data[0].user_settings));
			location.reload(); // reload the page
		}

		// when there's no settings
		else if (responseJSON.code === 404) showMessage(3, 'No settings found in the cloud.');
		// too many attempts
		else if (responseJSON.code === 429) showMessage(2, 'Too many attempts. Please slow down.');
		// all other cases
		else showMessage(2, 'There was an error while downloading your settings.');

		settingsDownloadInProcess = false;
	}

	// email the token to the email provided by the user
	async function emailToken() {
		const email = document.getElementById('user-email').value;

		if (!validateEmail(email)) return showMessage(2, "That doesn't look like a proper email...");

		tokenEmailInProcess = true;
		showMessage(4, 'Emailing you the token, please wait...');

		const response = await fetch(`${userAPIEndpoint}/email`, {
			method: 'POST',
			headers: {
				'user-token': $__userToken,
				'user-email': email
			}
		});

		const responseJSON = await response.json();

		if (responseJSON.code === 200) showMessage(1, `Token has been emailed on ${email}.`);
		// all other cases
		else showMessage(3, 'Some error occurred.');

		tokenEmailed = true;
		tokenEmailInProcess = false;
		tokenCloudButtonsVisible = true;
	}

	// save the token in localStorage and store
	function saveToken(token) {
		__userToken.set(token);
		localStorage.setItem('userToken', token);
	}

	// delete token from localStorage and store
	function deleteToken() {
		localStorage.removeItem('userToken');
		__userToken.set(null);

		// collapse both tabs
		switchTabs(0);
	}

	// copy token on click
	function copyToken() {
		navigator.clipboard.writeText($__userToken);
		showMessage(1, 'Token has been copied to clipboard.');
	}

	// open share menu
	function shareToken() {
		if (navigator.share) {
			navigator
				.share({
					title: 'QuranWBW Login Token',
					text: $__userToken
				})
				.then(() => console.log('Successful share'))
				.catch((error) => console.log('Error sharing', error));
		}
	}

	// switch tabs and clear the message
	function switchTabs(tab) {
		tokenTab = tab;
		tokenMessageText = '';
		tokenGenerated = false;
		tokenEmailed = false;

		if (tab === 1) showMessage(3, 'Enter your token in the input box below to validate it.');
		else if (tab === 2) showMessage(3, 'Click the button below to generate your unique token.');
		else if (tab === 3) {
			showMessage(3, 'Enter your email in the input box below.');
			tokenCloudButtonsVisible = false;
		}
	}

	// show message with its respective icon
	function showMessage(type, message) {
		tokenMessageText = message;
		tokenMessageType = type;
	}

	// basic email validation
	function validateEmail(email) {
		return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	}
</script>

<!-- token modal -->
<div id="token-modal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full text-sm p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full theme-grayscale">
	<div class="relative w-full max-w-xl max-h-full">
		<!-- Modal content -->
		<div class="relative bg-white rounded-3xl shadow daaark:bg-gray-700">
			<button type="button" on:click={() => toggleModal('token-modal', 'hide')} class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-3xl text-sm w-8 h-8 ml-auto inline-flex justify-center items-center daaark:hover:bg-gray-600 daaark:hover:text-white" data-modal-hide="token-modal">
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
				{#if tokenMessageText !== undefined && tokenMessageText !== ''}
					<div id="token-message" class="text-sm font-medium text-center">
						<div class="inline-flex items-center justify-center space-x-1">
							<svelte:component this={messageTypeIcons[tokenMessageType].icon} />
							<span>{tokenMessageText}</span>
						</div>
					</div>
				{/if}

				<!-- email token -->
				<!-- {#if tokenEmailed === false}
          {#if tokenGenerated === true}
            <div class="flex py-4">
              <button on:click={() => switchTabs(3)} class="w-full {buttonElement}">Email Token</button>
            </div>
          {/if}
        {/if} -->

				<!-- I already have a token -->
				{#if tokenTab === 1 && $__userToken === null}
					<div id="already-have-a-token" class="flex flex-col space-y-4 justify-center">
						<input id="token-value" type="text" class="rounded-md w-full text-center text-xs" placeholder="Enter your token here..." />
						<button id="validate-token" on:click={() => validateToken()} class="w-full {buttonElement} {tokenValidationInProcess === true && disabledElement}">
							<span>{tokenValidationInProcess === false ? 'Validate Token' : 'Validating token...'}</span>
						</button>
					</div>
				{/if}

				<!-- I want a new token -->
				{#if tokenTab === 2 && $__userToken === null}
					<div id="want-to-generate-token" class="flex flex-col justify-center">
						{#if tokenGenerated === false}
							<button id="generate-token" on:click={() => generateToken()} class="w-full {buttonElement} {tokenGenerationInProcess === true && disabledElement}">
								<span>{tokenGenerationInProcess === false ? 'Generate Token' : 'Generating token...'}</span>
							</button>
						{/if}
					</div>
				{/if}

				<!-- email token -->
				{#if tokenTab === 3 && $__userToken !== null && tokenEmailed === false}
					<div id="email-token" class="flex flex-col space-y-2 justify-center">
						<input id="user-email" type="email" class="rounded-md w-full text-center text-xs" placeholder="email@example.com" />
						<button id="email-button" on:click={() => emailToken()} class="w-full {buttonElement} {tokenEmailInProcess === true && disabledElement}">
							<Email />
							<span> {tokenEmailInProcess === false ? 'Email Token' : 'Emailing...'} </span>
						</button>
					</div>
				{/if}

				<!-- cloud upload/download/delete buttons -->
				{#if $__userToken}
					<div id="token-cloud-buttons" class="{tokenCloudButtonsVisible === true ? 'block' : 'hidden'} flex flex-col space-y-6">
						<!-- input box and download button -->
						<div class="flex flex-row space-x-2">
							<input id="token-value" type="text" on:click={() => copyToken()} value={$__userToken} class="rounded-md w-full text-center text-xs cursor-pointer" readonly="readonly" />

							<!-- if browser supports web share api, show share button, else show download button -->
							{#if navigator.share}
								<!-- Share token -->
								<button id="share-token" title="Share Token" on:click={() => shareToken()} class="w-fit {buttonElement}">
									<Share />
								</button>
							{:else}
								<!-- download file -->
								<button id="download-token-file" title="Download Token" on:click={() => downloadTextFile(`quranwbw-token-${$__userToken}`, $__userToken)} class="w-fit {buttonElement}">
									<Download />
								</button>
							{/if}

							<!-- email token -->
							<!-- <button id="email-token" title="Email Token" on:click={() => emailToken()} class="w-fit {buttonElement}">
                <Email />
              </button> -->
						</div>

						<div class="flex flex-col space-y-4">
							<!-- download / upload buttons -->
							<div class="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
								<button id="upload-settings" on:click={() => uploadSettings()} class="w-full {buttonElement} {settingsUploadInProcess === true && disabledElement}">
									<CloudUpload />
									<span> {settingsUploadInProcess === false ? 'Backup Settings To Cloud' : 'Uploading settings...'} </span>
								</button>

								<button id="download-settings" on:click={() => downloadSettings()} class="w-full {buttonElement} {settingsDownloadInProcess === true && disabledElement}">
									<CloudDownload />
									<span> {settingsDownloadInProcess === false ? 'Restore Settings From Cloud' : 'Downloading settings...'} </span>
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
