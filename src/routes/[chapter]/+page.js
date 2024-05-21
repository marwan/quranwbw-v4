import { error } from '@sveltejs/kit';
import { goto } from '$app/navigation';
import { validateKey } from '$utils/validateKey';

export async function load({ params }) {
	// if a colon exists and the param is a valid key
	if (params.chapter.includes(':') && validateKey(params.chapter)) {
		goto(`/${params.chapter.split(':')[0]}/${params.chapter.split(':')[1]}`, { replaceState: false });
	}

	// basic chapter number check
	else if (isNaN(params.chapter) || params.chapter < 1 || params.chapter > 114) {
		error(404, {
			message: 'Not found'
		});
	}

	return { chapter: params.chapter };
}
