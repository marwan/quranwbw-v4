import { __timeSpecificChapters } from '$utils/stores';

export function checkTimeSpecificChapters() {
	const currentTime = new Date().getHours();
	const isNight = currentTime >= 4 && currentTime <= 19 ? false : true;
	const isFriday = new Date().getDay() === 5 ? true : false;

	__timeSpecificChapters.set({
		isFriday,
		isNight
	});
}
