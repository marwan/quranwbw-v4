<script>
	import Modal from '$ui/FlowbiteSvelte/modal/Modal.svelte';
	import Download from '$svgs/Download.svelte';
	import Share from '$svgs/Share.svelte';
	import CloudDownload from '$svgs/CloudDownload.svelte';
	import CloudUpload from '$svgs/CloudUpload.svelte';
	import { buttonClasses, disabledClasses, linkClasses } from '$data/commonClasses';
	import { __userToken, __userSettings, __tokenModalVisible } from '$utils/stores';
	import { apiEndpoint } from '$data/websiteSettings';
	import { downloadTextFile } from '$utils/downloadTextFile';
	import { downloadSettingsFromCloud, uploadSettingsToCloud } from '$utils/cloudSettings';

	let tokenTab = 0,
		tokenGenerated = false,
		tokenGenerationInProcess = false,
		tokenValidationInProcess = false,
		settingsDownloadInProcess = false,
		settingsUploadInProcess = false,
		tokenCloudButtonsVisible = true,
		tokenMessageText;

	// validate the token provided by user
	async function validateToken() {
		const token = document.getElementById('token-value').value;

		// basic checks
		if (token === '') return (tokenMessageText = 'You have not entered anything.');
		if (token.length !== 10) return (tokenMessageText = 'Invalid token length.');

		tokenValidationInProcess = true;
		tokenMessageText = 'Validating your token, please wait...';

		const response = await fetch(`${apiEndpoint}/user/tokens/check`, {
			method: 'GET',
			headers: {
				'user-token': token
			}
		});

		const tokenJSON = await response.json();

		// save the token
		if (tokenJSON.code === 200) {
			tokenMessageText = 'Your token has been saved.';
			saveToken(token);
			// location.reload(); // reload the page
		}

		// limit token generation
		else if (tokenJSON.code === 429) tokenMessageText = 'You have reached the limit of token validation. Try later.';
		// all other cases
		else tokenMessageText = 'The token is not valid.';

		tokenValidationInProcess = false;
	}

	// generate a new token for user
	async function generateToken() {
		tokenGenerationInProcess = true;
		tokenMessageText = 'Generating a token, please wait...';

		const response = await fetch(`${apiEndpoint}/user/tokens/generate`, {
			method: 'POST',
			headers: {
				'user-agent': navigator.userAgent,
				'Content-Type': 'application/json'
			}
		});

		const responseJSON = await response.json();

		if (responseJSON.code === 200) {
			tokenGenerated = true;
			tokenMessageText = 'A token has been generated and saved. Make sure to back it up.';
			saveToken(responseJSON.data[0].user_token);
		}

		// limit token generation
		else if (responseJSON.code === 429) tokenMessageText = 'You have reached the limit of token generation. Try later.';
		// all other cases
		else tokenMessageText = 'There was an error generating a token.';

		tokenGenerationInProcess = false;
	}

	// upload user's settings to cloud
	async function uploadSettings() {
		settingsUploadInProcess = true;
		tokenMessageText = 'Uploading your settings, please wait...';

		const responseJSON = await uploadSettingsToCloud();

		if (responseJSON.code === 200) tokenMessageText = 'Settings have been uploaded.';
		// too many attempts
		else if (responseJSON.code === 429) tokenMessageText = 'Too many attempts. Please slow down.';
		// all other cases
		else tokenMessageText = 'There was an error while uploading your settings.';

		settingsUploadInProcess = false;
	}

	// download user's settings from cloud
	async function downloadSettings() {
		settingsDownloadInProcess = true;
		tokenMessageText = 'Downloading your settings, please wait...';

		const responseJSON = await downloadSettingsFromCloud();

		if (responseJSON.code === 200) {
			tokenMessageText = 'Settings have been downloaded.';
			// localStorage.setItem('userSettings', JSON.stringify(responseJSON.data[0].user_settings));
			// location.reload(); // reload the page
		}

		// when there's no settings
		else if (responseJSON.code === 404) tokenMessageText = 'No settings found in the cloud.';
		// too many attempts
		else if (responseJSON.code === 429) tokenMessageText = 'Too many attempts. Please slow down.';
		// all other cases
		else tokenMessageText = 'There was an error while downloading your settings.';

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
		tokenMessageText = 'Token has been copied to clipboard.';
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

		if (tab === 1) tokenMessageText = 'Enter your token in the input box below to validate it.';
		else if (tab === 2) tokenMessageText = 'Click the button below to generate your unique token.';
		else if (tab === 3) {
			tokenMessageText = 'Enter your email in the input box below.';
			tokenCloudButtonsVisible = false;
		}
	}
</script>

<Modal title="Token Login" id="tokenModal" bind:open={$__tokenModalVisible} class="rounded-3xl text-black theme" bodyClass="p-6 space-y-4 flex-1 overflow-y-auto overscroll-contain" headerClass="flex justify-between items-center p-6 rounded-t-3xl text-black" center outsideclose>
	<div id="token-info" class="flex flex-col space-y-4 text-sm text-black">
		<span>Token Login allows you to save your settings (bookmarks & notes for now) in the cloud without the need of creating an account or providing any personal details.</span>
		<a href="/faq#11" class={linkClasses} on:click={() => __tokenModalVisible.set(false)}>You can read more about it on our FAQs page (#11).</a>
	</div>

	<!-- tabs buttons -->
	{#if $__userToken === null}
		<div class="flex flex-col space-y-2 mt-4 md:flex-row md:space-x-2 md:space-y-0">
			<button on:click={() => switchTabs(1)} class="w-full {buttonClasses}">I have a token</button>
			<button on:click={() => switchTabs(2)} class="w-full {buttonClasses}">I want a token</button>
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
		<div id="already-have-a-token" class="flex flex-row justify-center">
			<input id="token-value" type="text" class="rounded-l-full rounded-r-none w-full text-center text-xs" placeholder="Your token here..." />
			<button id="validate-token" on:click={() => validateToken()} class="w-full {buttonClasses} rounded-l-none border-0 {tokenValidationInProcess === true && disabledClasses}">
				<span>{!tokenValidationInProcess ? 'Validate Token' : 'Validating token...'}</span>
			</button>
		</div>
	{/if}

	<!-- I want a new token -->
	{#if tokenTab === 2 && $__userToken === null}
		<div id="want-to-generate-token" class="flex flex-col justify-center">
			{#if !tokenGenerated}
				<button id="generate-token" on:click={() => generateToken()} class="w-full {buttonClasses} {tokenGenerationInProcess === true && disabledClasses}">
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
					<button id="share-token" title="Share Token" on:click={() => shareToken()} class="w-fit {buttonClasses}">
						<Share />
					</button>
				{:else}
					<!-- download file -->
					<button id="download-token-file" title="Download Token" on:click={() => downloadTextFile(`quranwbw-token-${$__userToken}`, $__userToken)} class="w-fit {buttonClasses}">
						<Download />
					</button>
				{/if}
			</div>

			<div class="flex flex-col space-y-4">
				<!-- download / upload buttons -->
				<div class="flex flex-row space-x-2 space-y-0">
					<button id="upload-settings" on:click={() => uploadSettings()} class="w-full {buttonClasses} {settingsUploadInProcess || settingsDownloadInProcess ? disabledClasses : null}">
						<CloudUpload />
						<span> {!settingsUploadInProcess ? 'Backup' : 'Uploading...'} </span>
					</button>

					<button id="download-settings" on:click={() => downloadSettings()} class="w-full {buttonClasses} {settingsUploadInProcess || settingsDownloadInProcess ? disabledClasses : null}">
						<CloudDownload />
						<span> {!settingsDownloadInProcess ? 'Restore' : 'Downloading...'} </span>
					</button>
				</div>

				<!-- delete token button -->
				<button id="delete-token" on:click={() => deleteToken()} class="{buttonClasses} w-full {settingsUploadInProcess || settingsDownloadInProcess ? disabledClasses : null}">
					<span>Delete Token</span>
				</button>
			</div>
		</div>
	{/if}
</Modal>
