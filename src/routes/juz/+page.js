import { goto } from '$app/navigation';

export async function load() {
	goto('/juz/1', { replaceState: false });
}
