# Resources

- [Let's Build a Custom GPT-3 AI Application](https://www.youtube.com/watch?v=fop6hOu8Pck&list=PLq30BP0TIcqXP149TyFMfRhnMT6T5--e5&index=22)
- [git repo](https://github.com/huntabyte/elif-ai)

- [openai playground](https://platform.openai.com/playground/chat?models=gpt-4o)

---

## Demoing openai playground

- [openai playground](https://platform.openai.com/playground/chat?models=gpt-4o)

demo: generador de cuestionarios - min trabajo

preset link: https://platform.openai.com/playground/p/vTwumO2Oc7kZfLQ3XD5hQDs0?model=undefined&mode=chat

system

```
  Eres un generador de cuestionarios interactivos diseñados como un juego de preguntas y respuestas para evaluar
  conocimientos. Tu tarea es crear cuestionarios en formato JSON especificado en response_format:

  1.  Título del Cuestionario: Sé creativo al elegir un título atractivo que refleje el tema del cuestionario.

  2.  Descripción: Proporciona una descripción clara que brinde contexto sobre el tema del cuestionario,
      respetando el tono indicado. Limita la descripción a un máximo de 100 palabras.

  3.  Contenido de las Preguntas: Cada pregunta debe ser educativa, con una descripción adicional
      que provea contexto sin revelar la respuesta. Cada palabra debe ser de tipo 'unica'.
      Limita las descripciones a un máximo de 100 palabras.

  4.  Respuestas y Opciones: Incluye entre 3 y 5 opciones distintas para cada pregunta, con solo una
      opción correcta. Limita las opciones a un máximo de 30 palabras por cada opción.
```

user

```
Tu tarea es generar un cuestionario sobre '{tema}', con '{preguntas}' preguntas, dificultad '{dificultad}' utilizando un tono sumamente '{tono}'"
```

```
Tu tarea es generar un cuestionario sobre 'Ministerio de Trabajo de Argentina', con '3' preguntas, dificultad 'difícil' utilizando un tono sumamente 'didáctico'
```

schema

```json
{
	"name": "cuestionario",
	"strict": true,
	"schema": {
		"type": "object",
		"additionalProperties": false,
		"required": ["id", "titulo", "descripcion", "preguntas"],
		"properties": {
			"id": {
				"type": "string"
			},
			"titulo": {
				"type": "string"
			},
			"descripcion": {
				"type": "string"
			},
			"preguntas": {
				"type": "array",
				"items": {
					"type": "object",
					"additionalProperties": false,
					"required": ["id", "titulo", "descripcion", "tipo", "opciones", "solucion"],
					"properties": {
						"id": {
							"type": "string"
						},
						"titulo": {
							"type": "string"
						},
						"descripcion": {
							"type": "string"
						},
						"tipo": {
							"type": "string",
							"const": "unica"
						},
						"opciones": {
							"type": "array",
							"items": {
								"type": "string"
							}
						},
						"solucion": {
							"type": "string"
						}
					}
				}
			}
		}
	}
}
```
