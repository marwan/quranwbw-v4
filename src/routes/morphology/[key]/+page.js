import { error } from '@sveltejs/kit';
import { isValidVerseKey, isValidWordKey } from '$utils/validateKey';

export async function load({ params }) {
	const key = params.key;

	if (!isValidVerseKey(key) && !(await isValidWordKey(key))) {
		error(404, {
			message: 'Not found'
		});
	}

	return { key };
}
