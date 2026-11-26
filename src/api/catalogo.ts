import type { Categoria, NuevoProducto, Producto } from "../types";
import { http } from "./cliente";

export const productosApi = {
  listar: () => http.get<Producto[]>("/productos", false),
  crear: (d: NuevoProducto) => http.post<Producto>("/productos", d),
  actualizar: (id: string, d: NuevoProducto) => http.put<Producto>(`/productos/${id}`, d),
  cambiarStock: (id: string, stock: number) => http.patch<Producto>(`/productos/${id}/stock`, { stock }),
  eliminar: (id: string) => http.delete(`/productos/${id}`),
};

export const categoriasApi = {
  listar: () => http.get<Categoria[]>("/categorias", false),
  crear: (d: Omit<Categoria, "id">) => http.post<Categoria>("/categorias", d),
  actualizar: (id: string, d: Omit<Categoria, "id">) => http.put<Categoria>(`/categorias/${id}`, d),
  eliminar: (id: string) => http.delete(`/categorias/${id}`),
};
