/** data/categoriasRepo.ts — CRUD de categorías sobre LocalStorage. */
import type { Categoria } from "../types";
import { CLAVES, guardar, leer, siguienteId } from "./storage";

export const categoriasRepo = {
  listar(): Categoria[] {
    return leer<Categoria[]>(CLAVES.categorias, []);
  },

  obtener(id: string): Categoria | null {
    return this.listar().find((c) => c.id === id) ?? null;
  },

  crear(datos: Omit<Categoria, "id">): Categoria {
    const categorias = this.listar();
    const nueva: Categoria = { ...datos, id: siguienteId("C", categorias.map((c) => c.id)) };
    guardar(CLAVES.categorias, [...categorias, nueva]);
    return nueva;
  },

  actualizar(id: string, cambios: Partial<Omit<Categoria, "id">>): boolean {
    const categorias = this.listar();
    if (!categorias.some((c) => c.id === id)) return false;
    guardar(CLAVES.categorias, categorias.map((c) => (c.id === id ? { ...c, ...cambios } : c)));
    return true;
  },

  eliminar(id: string): boolean {
    const categorias = this.listar();
    if (!categorias.some((c) => c.id === id)) return false;
    guardar(CLAVES.categorias, categorias.filter((c) => c.id !== id));
    return true;
  },
};
