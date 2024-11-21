import { sineIn } from 'svelte/easing';
import { getTailwindBreakpoint } from '$utils/getTailwindBreakpoint';

const duration = 150;

export function getModalTransition(type) {
	// for basic modals
	if (type === 'basic') {
		return {
			duration: duration,
			easing: sineIn
		};
	}

	// other modals
	else {
		// small screen
		if (['default', 'sm'].includes(getTailwindBreakpoint())) {
			// for modals sliding in from top
			if (type === 'top') {
				return {
					y: -320,
					duration: duration,
					easing: sineIn
				};
			}

			// for modals sliding in from bottom
			else if (type === 'bottom') {
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
}
