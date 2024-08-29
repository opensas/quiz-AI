export type Encuesta = {
	id: `enc_${string}`;
	codigo: string;
	titulo: string;
	descripcion?: string;
	preguntas: Pregunta[];
};

export type TipoPregunta = Pregunta['tipo'];

export type Opcion = { titulo: string; descripcion?: string };

export type PreguntaUnica = Extract<Pregunta, { tipo: 'unica' }>;
export type PreguntaMultiple = Extract<Pregunta, { tipo: 'multiple' }>;
export type PreguntaPuntaje = Extract<Pregunta, { tipo: 'puntaje' }>;
export type PreguntaLibre = Extract<Pregunta, { tipo: 'libre' }>;

export type Pregunta = {
	id: `preg_${string}`;
	titulo: string;
	descripcion?: string;
	solucion?: Pregunta['respuesta'];
	// tipo: TipoPregunta; // 'unica' | 'multiple' | 'puntaje' | 'libre'
} & (
	| {
			tipo: 'unica';
			opciones: Array<Opcion | string>;
			acepta_otros?: boolean;
			texto_otros?: string;
			respuesta?: string;
	  }
	| {
			tipo: 'multiple';
			opciones: Array<Opcion | string>;
			acepta_otros?: boolean;
			texto_otros?: string;
			respuesta?: string[];
	  }
	| {
			tipo: 'puntaje';
			respuesta?: number;
	  }
	| {
			tipo: 'libre';
			respuesta?: string;
	  }
);
