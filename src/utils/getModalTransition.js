import { sineIn } from 'svelte/easing';
import { getTailwindBreakpoint } from '$utils/getTailwindBreakpoint';

const duration = 150;

export function getModalTransition(position) {
	// small screen
	if (['default', 'sm'].includes(getTailwindBreakpoint())) {
		// for modals sliding in from top
		if (position === 'top') {
			return {
				y: -320,
				duration: duration,
				easing: sineIn
			};
		}

		// for modals sliding in from bottom
		else if (position === 'bottom') {
			return {
				y: 320,
				duration: duration,
				easing: sineIn
			};
		}
	}

	// medium and greater size screens
	else {
		return {
			duration: duration,
			easing: sineIn
		};
	}
}
