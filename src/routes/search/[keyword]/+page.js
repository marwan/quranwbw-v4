export async function load({ params }) {
	const keyword = params.keyword;
	return { keyword };
}
