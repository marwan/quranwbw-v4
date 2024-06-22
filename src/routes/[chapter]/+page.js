import { error } from '@sveltejs/kit';
import { goto } from '$app/navigation';
import { isValidVerseKey } from '$utils/validateKey';
// import { chapterSlugs } from '$data/quranMeta';

export async function load({ params }) {
	// // if a chapter slug was provided
	// if (Object.prototype.hasOwnProperty.call(chapterSlugs, params.chapter)) {
	// 	goto(`/${chapterSlugs[params.chapter]}`, { replaceState: false });
	// }

	// if a colon exists and the param is a valid key
	if (params.chapter.includes(':') && isValidVerseKey(params.chapter)) {
		goto(`/${params.chapter.split(':')[0]}/${params.chapter.split(':')[1]}`, { replaceState: false });
	}

	// basic chapter number check
	if (isNaN(params.chapter) || params.chapter < 1 || params.chapter > 114) {
		error(404, {
			message: 'Not found'
		});
	}

	return { chapter: params.chapter };
}
