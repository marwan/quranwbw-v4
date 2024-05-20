export async function load({ params }) {
	return { chapter: params.chapter, verse: params.verse };
}
