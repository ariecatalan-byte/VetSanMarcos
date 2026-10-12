import type { EntradaBlog } from "../types";

/** Entradas del blog (contenido estático de la tienda). */
export const ENTRADAS_BLOG: EntradaBlog[] = [
  {
    slug: "desparasitacion-al-dia",
    titulo: "Desparasitación al día: cada cuánto y por qué",
    resumen: "Las pulgas, garrapatas y parásitos internos se previenen con un calendario simple.",
    fecha: "2026-09-02",
    contenido: [
      "Mantener la desparasitación al día es una de las medidas más simples y efectivas para proteger la salud de perros y gatos.",
      "En general, los cachorros se desparasitan con mayor frecuencia y los adultos siguen un calendario que depende del producto utilizado (mensual o cada 12 semanas en el caso de los de acción prolongada).",
      "Antes de elegir un antiparasitario revisa la especie y el peso indicados en el envase y consulta siempre a tu médico veterinario ante cualquier duda.",
    ],
  },
  {
    slug: "alimentacion-segun-etapa",
    titulo: "Alimentación según la etapa de vida de tu mascota",
    resumen: "Cachorro, adulto o esterilizado: cada etapa requiere un alimento distinto.",
    fecha: "2026-09-16",
    contenido: [
      "Los requerimientos de proteína, grasa y minerales cambian a lo largo de la vida de una mascota, por lo que conviene elegir un alimento formulado para su etapa.",
      "Los animales esterilizados tienden a ganar peso con mayor facilidad: existen fórmulas con control de calorías y fibra que ayudan a mantener un peso saludable.",
      "Cambia el alimento de forma gradual durante 7 a 10 días para evitar molestias digestivas.",
    ],
  },
];
