<script>
	import { buttonElement, disabledElement, linkElement } from '$data/commonStyles';
	import { __userToken, __userSettings, __tokenModalVisible } from '$utils/stores';
	import { downloadTextFile } from '$utils/downloadTextFile';
	import { Modal } from 'flowbite-svelte';

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
</script>

<Modal title="Token Login" id="tokenModal" bind:open={$__tokenModalVisible} class="rounded-3xl theme-grayscale" bodyClass="p-6 space-y-4 flex-1 overflow-y-auto overscroll-contain" headerClass="flex justify-between items-center p-6 rounded-t-3xl" center outsideclose>
	<div id="token-info" class="flex flex-col space-y-4 text-sm">
		<span>Token Login allows you to save your settings in the cloud without the need of creating an account or providing any personal details.</span>
		<a href="/faq#11" class={linkElement} on:click={() => __tokenModalVisible.set(false)}>You can read more about it on our FAQs page (#11).</a>
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
				<!-- <svelte:component this={messageTypeIcons[tokenMessageType].icon} /> -->
				<span>{tokenMessageText}</span>
			</div>
		</div>
	{/if}

	<!-- I already have a token -->
	{#if tokenTab === 1 && $__userToken === null}
		<div id="already-have-a-token" class="flex flex-col space-y-4 justify-center">
			<input id="token-value" type="text" class="rounded-md w-full text-center text-xs" placeholder="Enter your token here..." />
			<button id="validate-token" on:click={() => validateToken()} class="w-full {buttonElement} {tokenValidationInProcess === true && disabledElement}">
				<span>{!tokenValidationInProcess ? 'Validate Token' : 'Validating token...'}</span>
			</button>
		</div>
	{/if}

	<!-- I want a new token -->
	{#if tokenTab === 2 && $__userToken === null}
		<div id="want-to-generate-token" class="flex flex-col justify-center">
			{#if !tokenGenerated}
				<button id="generate-token" on:click={() => generateToken()} class="w-full {buttonElement} {tokenGenerationInProcess === true && disabledElement}">
					<span>{!tokenGenerationInProcess ? 'Generate Token' : 'Generating token...'}</span>
				</button>
			{/if}
		</div>
	{/if}

	<!-- cloud upload/download/delete buttons -->
	{#if $__userToken}
		<div id="token-cloud-buttons" class="{tokenCloudButtonsVisible ? 'block' : 'hidden'} flex flex-col space-y-6">
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
			</div>

			<div class="flex flex-col space-y-4">
				<!-- download / upload buttons -->
				<div class="flex flex-row space-x-2 space-y-0">
					<button id="upload-settings" on:click={() => uploadSettings()} class="w-full {buttonElement} {settingsUploadInProcess || settingsDownloadInProcess ? disabledElement : ''}">
						<CloudUpload />
						<span> {!settingsUploadInProcess ? 'Backup' : 'Uploading...'} </span>
					</button>

					<button id="download-settings" on:click={() => downloadSettings()} class="w-full {buttonElement} {settingsUploadInProcess || settingsDownloadInProcess ? disabledElement : ''}">
						<CloudDownload />
						<span> {!settingsDownloadInProcess ? 'Restore' : 'Downloading...'} </span>
					</button>
				</div>

				<!-- delete token button -->
				<button id="delete-token" on:click={() => deleteToken()} class="{buttonElement} w-full bg-gray-600 hover:bg-lightGray {settingsUploadInProcess || settingsDownloadInProcess ? disabledElement : ''}">
					<span>Delete Token</span>
				</button>
			</div>
		</div>
	{/if}
</Modal>
