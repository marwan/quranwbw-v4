import { goto } from '$app/navigation';

export async function load() {
	goto('/morphology/1:1:1', { replaceState: false });
}
