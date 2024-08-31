export function load({ url }) {
	return { query: Object.fromEntries(url.searchParams) };
}
