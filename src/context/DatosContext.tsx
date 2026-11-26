/**
 * context/DatosContext.tsx
 * -----------------------------------------------------------------------
 * Contexto del CATÁLOGO: productos y categorías, obtenidos de la API REST.
 * Cada operación de escritura (1) revisa el permiso del rol (la UI), (2) llama a la
 * API —que vuelve a validar permisos y reglas en el servidor—, (3) recarga el catálogo
 * para que la interfaz se actualice sola, y (4) devuelve un Resultado con el mensaje
 * de éxito o error para el usuario.
 * -----------------------------------------------------------------------
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Categoria, NuevoProducto, Producto, Resultado } from "../types";
import { categoriasApi, productosApi } from "../api/catalogo";
import { comoResultado, mensajeDeError } from "../api/cliente";
import { puede, SIN_PERMISO } from "../utils/permisos";
import { useAuth } from "./AuthContext";

interface DatosValor {
  productos: Producto[];
  categorias: Categoria[];
  cargando: boolean;
  /** Mensaje si no se pudo cargar el catálogo (p. ej. backend apagado). */
  error: string;
  recargar: () => Promise<void>;
  crearProducto: (datos: NuevoProducto) => Promise<Resultado>;
  actualizarProducto: (id: string, datos: NuevoProducto) => Promise<Resultado>;
  cambiarStock: (id: string, stock: number) => Promise<Resultado>;
  eliminarProducto: (id: string) => Promise<Resultado>;
  crearCategoria: (datos: Omit<Categoria, "id">) => Promise<Resultado>;
  actualizarCategoria: (id: string, datos: Omit<Categoria, "id">) => Promise<Resultado>;
  eliminarCategoria: (id: string) => Promise<Resultado>;
}

const DatosContext = createContext<DatosValor | null>(null);

export function DatosProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const rol = usuario?.rol;

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const recargar = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([productosApi.listar(), categoriasApi.listar()]);
      setProductos(p);
      setCategorias(c);
      setError("");
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  /** Ejecuta una escritura en la API y, si salió bien, recarga el catálogo. */
  async function escribir(permiso: Parameters<typeof puede>[1], operacion: () => Promise<unknown>, exito: string): Promise<Resultado> {
    if (!puede(rol, permiso)) return SIN_PERMISO;
    const resultado = await comoResultado(operacion, exito);
    if (resultado.ok) await recargar();
    return resultado;
  }

  const valor: DatosValor = {
    productos, categorias, cargando, error, recargar,
    crearProducto: (d) => escribir("productos:crear", () => productosApi.crear(d), "Producto creado correctamente."),
    actualizarProducto: (id, d) => escribir("productos:editar", () => productosApi.actualizar(id, d), "Producto actualizado correctamente."),
    cambiarStock: (id, stock) => escribir("productos:stock", () => productosApi.cambiarStock(id, stock), "Stock actualizado."),
    eliminarProducto: (id) => escribir("productos:eliminar", () => productosApi.eliminar(id), "Producto eliminado."),
    crearCategoria: (d) => escribir("categorias:gestionar", () => categoriasApi.crear(d), "Categoría creada correctamente."),
    actualizarCategoria: (id, d) => escribir("categorias:gestionar", () => categoriasApi.actualizar(id, d), "Categoría actualizada correctamente."),
    eliminarCategoria: (id) => escribir("categorias:gestionar", () => categoriasApi.eliminar(id), "Categoría eliminada."),
  };
  const memo = useMemo(() => valor, [productos, categorias, cargando, error, rol]); // eslint-disable-line react-hooks/exhaustive-deps
  return <DatosContext.Provider value={memo}>{children}</DatosContext.Provider>;
}

export function useDatos(): DatosValor {
  const contexto = useContext(DatosContext);
  if (contexto === null) throw new Error("useDatos debe usarse dentro de <DatosProvider>");
  return contexto;
}
