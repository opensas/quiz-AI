import { redirect } from '@sveltejs/kit';

export function load() {
	redirect(302, '/quiz'); // needs `throw` in v1
}
