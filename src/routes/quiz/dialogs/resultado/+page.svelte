<script>
	import { DEFAULT_ENCUESTA } from '$lib/components/encuesta';

	import { Resultado } from '..';

	const encuesta = DEFAULT_ENCUESTA;
	encuesta.preguntas[1].solucion = encuesta.preguntas[1].respuesta;
	encuesta.preguntas[2].solucion = encuesta.preguntas[2].respuesta;
</script>

<div class="flex h-screen items-center justify-center">
	<Resultado {encuesta} />
</div>
