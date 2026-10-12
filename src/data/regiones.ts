import type { Region } from "../types";

/** Regiones y comunas de Chile (subconjunto) usadas por los selects dependientes región → comuna. */
export const REGIONES: Region[] = [
  { nombre: "Región Metropolitana de Santiago", comunas: ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "Maipú", "Puente Alto"] },
  { nombre: "Región de Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "San Antonio"] },
  { nombre: "Región del Biobío", comunas: ["Concepción", "Talcahuano", "Los Ángeles", "Chillán"] },
  { nombre: "Región de Coquimbo", comunas: ["La Serena", "Coquimbo", "Ovalle"] },
  { nombre: "Región de La Araucanía", comunas: ["Temuco", "Villarrica", "Angol"] },
  { nombre: "Región de Los Lagos", comunas: ["Puerto Montt", "Osorno", "Castro"] },
];

export function comunasDeRegion(nombreRegion: string): string[] {
  return REGIONES.find((r) => r.nombre === nombreRegion)?.comunas ?? [];
}
