import type { Producto } from "../types";
import { precioFinal } from "./formato";

export interface FiltrosProductos {
  categoriaId: string; // "todas" = sin filtrar
  precioMax: number;
  texto: string;
}

/** Aplica los filtros combinables del catálogo (categoría + precio máximo + búsqueda por nombre). */
export function filtrarProductos(productos: Producto[], filtros: FiltrosProductos): Producto[] {
  const texto = filtros.texto.trim().toLowerCase();
  return productos.filter((p) => {
    const coincideCategoria = filtros.categoriaId === "todas" || p.categoriaId === filtros.categoriaId;
    const coincidePrecio = precioFinal(p) <= filtros.precioMax;
    const coincideTexto = texto === "" || p.nombre.toLowerCase().includes(texto);
    return coincideCategoria && coincidePrecio && coincideTexto;
  });
}

export function esStockCritico(p: Producto): boolean {
  return p.stock <= p.stockCritico;
}
