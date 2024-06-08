import { goto } from '$app/navigation';

export async function load() {
	goto('/games/guess-the-word', { replaceState: false });
}
