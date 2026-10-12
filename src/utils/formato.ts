import type { Producto } from "../types";
import { IMAGEN_POR_DEFECTO } from "../data/constantes";

/** 4200 → "$4.200" */
export function formatearCLP(valor: number): string {
  return valor.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

export function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" });
}

/** Precio final del producto aplicando su descuento (si lo tiene). */
export function precioFinal(producto: Pick<Producto, "precio" | "descuento">): number {
  return Math.round((producto.precio * (100 - producto.descuento)) / 100);
}

/** Resuelve la ruta de una imagen respecto a la base de Vite (funciona en cualquier hosting). */
export function rutaImagen(imagen: string): string {
  const ruta = imagen.trim() === "" ? IMAGEN_POR_DEFECTO : imagen;
  return /^https?:\/\//.test(ruta) ? ruta : import.meta.env.BASE_URL + ruta;
}
