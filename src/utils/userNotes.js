import { get } from 'svelte/store';
import { __userToken, __userNotes, __notesData } from '$utils/stores';

const userNotesEndpoint = 'https://api.quranwbw.com/v1/user/notes';

export function updateNotes(key, notes) {
	const userNotes = JSON.parse(localStorage.getItem('userNotes'));

	// we only save the note if it's length is greater than 1
	if (notes.length > 1) {
		userNotes[`${+key.split(':')[0]}:${+key.split(':')[1]}`] = {
			note: notes,
			modified_at: new Date().toISOString()
		};

		// set it back in localStorage
		__userNotes.set(userNotes);
		localStorage.setItem('userNotes', JSON.stringify(userNotes));
	}
}

// export async function updateNotes(key, notes) {
//   await fetch(userNotesEndpoint, {
//     method: "POST",
//     headers: {
//       "user-token": get(__userToken),
//       "chapter-number": +key.split(":")[0],
//       "verse-number": +key.split(":")[1],
//       "Content-Type": "text/plain",
//     },
//     body: notes,
//   });
// }

export async function getNotes(key) {
	const response = await fetch(userNotesEndpoint, {
		method: 'GET',
		headers: {
			'user-token': get(__userToken),
			'chapter-number': +key.split(':')[0],
			'Content-Type': 'text/plain'
		}
	});

	const notesJSON = await response.json();

	if (notesJSON.code === 200) {
		__notesData.set(notesJSON);
	}
}
