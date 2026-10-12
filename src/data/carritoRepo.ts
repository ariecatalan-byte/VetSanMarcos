/** data/carritoRepo.ts — persistencia del carrito (solo id + cantidad). */
import type { ItemCarrito } from "../types";
import { CLAVES, guardar, leer } from "./storage";

export const carritoRepo = {
  obtener(): ItemCarrito[] {
    return leer<ItemCarrito[]>(CLAVES.carrito, []);
  },
  guardar(items: ItemCarrito[]): void {
    guardar(CLAVES.carrito, items);
  },
};
