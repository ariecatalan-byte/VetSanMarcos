/**
 * data/productosRepo.ts — "archivo de datos" de productos con CRUD completo
 * (Crear, Leer, Actualizar, Eliminar) sobre LocalStorage.
 */
import type { LineaOrden, NuevoProducto, Producto } from "../types";
import { CLAVES, guardar, leer, siguienteId } from "./storage";

export const productosRepo = {
  /** READ: todos los productos. */
  listar(): Producto[] {
    return leer<Producto[]>(CLAVES.productos, []);
  },

  obtener(id: string): Producto | null {
    return this.listar().find((p) => p.id === id) ?? null;
  },

  /** CREATE: asigna un id correlativo (P013, P014...) y lo guarda. */
  crear(datos: NuevoProducto): Producto {
    const productos = this.listar();
    const nuevo: Producto = { ...datos, id: siguienteId("P", productos.map((p) => p.id)) };
    guardar(CLAVES.productos, [...productos, nuevo]);
    return nuevo;
  },

  /** UPDATE: reemplaza los campos indicados del producto. */
  actualizar(id: string, cambios: Partial<NuevoProducto>): boolean {
    const productos = this.listar();
    if (!productos.some((p) => p.id === id)) return false;
    guardar(CLAVES.productos, productos.map((p) => (p.id === id ? { ...p, ...cambios } : p)));
    return true;
  },

  /** DELETE */
  eliminar(id: string): boolean {
    const productos = this.listar();
    if (!productos.some((p) => p.id === id)) return false;
    guardar(CLAVES.productos, productos.filter((p) => p.id !== id));
    return true;
  },

  /**
   * Descuenta el stock de todas las líneas de una compra de forma atómica:
   * si alguna no tiene stock suficiente no se descuenta NADA y retorna el nombre del producto con problema.
   */
  descontarStock(lineas: Pick<LineaOrden, "idProducto" | "cantidad">[]): { ok: true } | { ok: false; producto: string } {
    const productos = this.listar();
    for (const linea of lineas) {
      const producto = productos.find((p) => p.id === linea.idProducto);
      if (!producto || producto.stock < linea.cantidad) {
        return { ok: false, producto: producto ? producto.nombre : linea.idProducto };
      }
    }
    const actualizados = productos.map((p) => {
      const linea = lineas.find((l) => l.idProducto === p.id);
      return linea ? { ...p, stock: p.stock - linea.cantidad } : p;
    });
    guardar(CLAVES.productos, actualizados);
    return { ok: true };
  },
};
