/** data/ordenesRepo.ts — órdenes de compra / boletas (lectura y creación). */
import type { Orden } from "../types";
import { CLAVES, guardar, leer } from "./storage";

export const ordenesRepo = {
  listar(): Orden[] {
    return leer<Orden[]>(CLAVES.ordenes, []);
  },

  obtener(id: string): Orden | null {
    return this.listar().find((o) => o.id === id) ?? null;
  },

  /** Crea la orden asignando número correlativo de boleta (empieza en 1001). */
  crear(datos: Omit<Orden, "id" | "numero" | "fecha">): Orden {
    const ordenes = this.listar();
    const numero = ordenes.reduce((max, o) => Math.max(max, o.numero), 1000) + 1;
    const orden: Orden = { ...datos, id: "O" + numero, numero, fecha: new Date().toISOString() };
    guardar(CLAVES.ordenes, [...ordenes, orden]);
    return orden;
  },
};
