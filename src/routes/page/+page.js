import { goto } from '$app/navigation';

export async function load() {
	goto('/page/1', { replaceState: false });
}
