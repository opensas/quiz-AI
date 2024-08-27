import { DEFAULT_ENCUESTA, encuestas } from '$lib/components/encuesta';

import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
	const encuesta = encuestas.find((e) => e.codigo === params.codigo);

	if (!encuesta) throw redirect(302, `/encuestas/${DEFAULT_ENCUESTA.codigo}`);

	return { encuesta };
}
