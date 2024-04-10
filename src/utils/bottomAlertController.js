// init the alert timer
let alertTimer;

export function showBottomAlert(message) {
	// clear the timeout
	window.clearTimeout(alertTimer);

	// first hide all the alerts
	document.querySelector('#bottom-alert').classList.remove('block');
	document.querySelector('#bottom-alert').classList.add('hidden');

	// set the inner message
	// document.querySelector("#bottom-alert > div").innerHTML = message;
	document.querySelector('#bottom-alert-message').innerHTML = message;

	// show the alert
	document.querySelector('#bottom-alert').classList.remove('hidden');
	document.querySelector('#bottom-alert').classList.add('block');

	// hide the alert after sometime
	alertTimer = setTimeout(function () {
		document.querySelector('#bottom-alert').classList.remove('block');
		document.querySelector('#bottom-alert').classList.add('hidden');
	}, 2000);
}

window.showBottomAlert = showBottomAlert;
