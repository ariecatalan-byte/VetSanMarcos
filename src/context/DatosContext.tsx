/**
 * context/DatosContext.tsx
 * -----------------------------------------------------------------------
 * Contexto de DATOS DE LA TIENDA: productos, categorías y órdenes.
 * Cada operación (1) valida el permiso del rol actual, (2) aplica las
 * reglas de negocio para mantener coherente la información, (3) escribe
 * en LocalStorage mediante los repositorios y (4) actualiza el estado de
 * React para que la interfaz se redibuje sola.
 * -----------------------------------------------------------------------
 */
import { createContext, useContext, useState, type ReactNode } from "react";
import type {
  Categoria, DatosCliente, DireccionEntrega, LineaCarrito, NuevoProducto, Orden, Producto, Resultado,
} from "../types";
import { categoriasRepo } from "../data/categoriasRepo";
import { ordenesRepo } from "../data/ordenesRepo";
import { productosRepo } from "../data/productosRepo";
import { puede, SIN_PERMISO } from "../utils/permisos";
import { useAuth } from "./AuthContext";

export interface SolicitudCompra {
  lineas: LineaCarrito[];
  cliente: DatosCliente;
  entrega: DireccionEntrega;
  pagoAprobado: boolean;
}

export interface ResultadoCompra extends Resultado {
  orden?: Orden;
}

interface DatosValor {
  productos: Producto[];
  categorias: Categoria[];
  ordenes: Orden[];
  crearProducto: (datos: NuevoProducto) => Resultado;
  actualizarProducto: (id: string, datos: Partial<NuevoProducto>) => Resultado;
  cambiarStock: (id: string, stock: number) => Resultado;
  eliminarProducto: (id: string) => Resultado;
  crearCategoria: (datos: Omit<Categoria, "id">) => Resultado;
  actualizarCategoria: (id: string, datos: Omit<Categoria, "id">) => Resultado;
  eliminarCategoria: (id: string) => Resultado;
  procesarCompra: (solicitud: SolicitudCompra) => ResultadoCompra;
}

const DatosContext = createContext<DatosValor | null>(null);

export function DatosProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const rol = usuario?.rol;

  const [productos, setProductos] = useState<Producto[]>(() => productosRepo.listar());
  const [categorias, setCategorias] = useState<Categoria[]>(() => categoriasRepo.listar());
  const [ordenes, setOrdenes] = useState<Orden[]>(() => ordenesRepo.listar());

  const refrescarProductos = () => setProductos(productosRepo.listar());
  const refrescarCategorias = () => setCategorias(categoriasRepo.listar());

  /* ------------------------------ productos ------------------------------ */
  function crearProducto(datos: NuevoProducto): Resultado {
    if (!puede(rol, "productos:crear")) return SIN_PERMISO;
    productosRepo.crear(datos);
    refrescarProductos();
    return { ok: true, mensaje: "Producto creado correctamente." };
  }

  function actualizarProducto(id: string, datos: Partial<NuevoProducto>): Resultado {
    if (!puede(rol, "productos:editar")) return SIN_PERMISO;
    if (!productosRepo.actualizar(id, datos)) return { ok: false, mensaje: "El producto no existe." };
    refrescarProductos();
    return { ok: true, mensaje: "Producto actualizado correctamente." };
  }

  /** El vendedor (y el administrador) pueden modificar SOLO el stock. */
  function cambiarStock(id: string, stock: number): Resultado {
    if (!puede(rol, "productos:stock")) return SIN_PERMISO;
    if (!Number.isInteger(stock) || stock < 0) return { ok: false, mensaje: "El stock debe ser un entero mayor o igual a 0." };
    if (!productosRepo.actualizar(id, { stock })) return { ok: false, mensaje: "El producto no existe." };
    refrescarProductos();
    return { ok: true, mensaje: "Stock actualizado." };
  }

  function eliminarProducto(id: string): Resultado {
    if (!puede(rol, "productos:eliminar")) return SIN_PERMISO;
    if (!productosRepo.eliminar(id)) return { ok: false, mensaje: "El producto no existe." };
    refrescarProductos();
    return { ok: true, mensaje: "Producto eliminado." };
  }

  /* ------------------------------ categorías ----------------------------- */
  function crearCategoria(datos: Omit<Categoria, "id">): Resultado {
    if (!puede(rol, "categorias:gestionar")) return SIN_PERMISO;
    categoriasRepo.crear(datos);
    refrescarCategorias();
    return { ok: true, mensaje: "Categoría creada correctamente." };
  }

  function actualizarCategoria(id: string, datos: Omit<Categoria, "id">): Resultado {
    if (!puede(rol, "categorias:gestionar")) return SIN_PERMISO;
    if (!categoriasRepo.actualizar(id, datos)) return { ok: false, mensaje: "La categoría no existe." };
    refrescarCategorias();
    return { ok: true, mensaje: "Categoría actualizada correctamente." };
  }

  /** Coherencia de datos: no se puede borrar una categoría que todavía tiene productos. */
  function eliminarCategoria(id: string): Resultado {
    if (!puede(rol, "categorias:gestionar")) return SIN_PERMISO;
    const enUso = productosRepo.listar().filter((p) => p.categoriaId === id).length;
    if (enUso > 0) {
      return { ok: false, mensaje: `No se puede eliminar: hay ${enUso} producto(s) en esta categoría. Reasígnalos o elimínalos primero.` };
    }
    if (!categoriasRepo.eliminar(id)) return { ok: false, mensaje: "La categoría no existe." };
    refrescarCategorias();
    return { ok: true, mensaje: "Categoría eliminada." };
  }

  /* -------------------------------- compra ------------------------------- */
  /**
   * Procesa el pago (simulado) del carrito:
   *  - pago aprobado: verifica y descuenta stock (regla de EP1) y guarda la orden como "pagada";
   *  - pago rechazado: guarda la orden como "rechazada" SIN tocar el stock.
   */
  function procesarCompra(solicitud: SolicitudCompra): ResultadoCompra {
    if (solicitud.lineas.length === 0) return { ok: false, mensaje: "El carrito está vacío." };

    if (solicitud.pagoAprobado) {
      const descuento = productosRepo.descontarStock(
        solicitud.lineas.map((l) => ({ idProducto: l.producto.id, cantidad: l.cantidad })),
      );
      if (!descuento.ok) {
        return { ok: false, mensaje: `No hay stock suficiente de "${descuento.producto}" para completar la compra.` };
      }
      refrescarProductos();
    }

    const orden = ordenesRepo.crear({
      estado: solicitud.pagoAprobado ? "pagada" : "rechazada",
      usuarioId: usuario?.id ?? null,
      cliente: solicitud.cliente,
      entrega: solicitud.entrega,
      lineas: solicitud.lineas.map((l) => ({
        idProducto: l.producto.id,
        nombre: l.producto.nombre,
        imagen: l.producto.imagen,
        precioUnitario: l.precioUnitario,
        cantidad: l.cantidad,
        subtotal: l.subtotal,
      })),
      total: solicitud.lineas.reduce((suma, l) => suma + l.subtotal, 0),
    });
    setOrdenes(ordenesRepo.listar());
    return { ok: true, mensaje: solicitud.pagoAprobado ? "Compra realizada con éxito." : "No se pudo realizar el pago.", orden };
  }

  const valor: DatosValor = {
    productos, categorias, ordenes, crearProducto, actualizarProducto, cambiarStock, eliminarProducto,
    crearCategoria, actualizarCategoria, eliminarCategoria, procesarCompra,
  };
  return <DatosContext.Provider value={valor}>{children}</DatosContext.Provider>;
}

export function useDatos(): DatosValor {
  const contexto = useContext(DatosContext);
  if (contexto === null) throw new Error("useDatos debe usarse dentro de <DatosProvider>");
  return contexto;
}
