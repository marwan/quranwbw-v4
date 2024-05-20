import { error } from '@sveltejs/kit';

export async function load({ params }) {
	// basic chapter number check
	if (isNaN(params.chapter) || params.chapter < 1 || params.chapter > 114) {
		error(404, {
			message: 'Not found'
		});
	}

	return { chapter: params.chapter };
}
