import { redirect } from '@sveltejs/kit';

export function load() {
	redirect(302, '/encuestas'); // needs `throw` in v1
}
