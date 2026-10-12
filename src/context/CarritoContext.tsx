/**
 * context/CarritoContext.tsx
 * -----------------------------------------------------------------------
 * Carrito de compras. El estado guardado es mínimo (idProducto + cantidad)
 * y se persiste en LocalStorage; los datos del producto (nombre, precio
 * con descuento, stock) se obtienen SIEMPRE del catálogo actual, así el
 * carrito nunca queda desactualizado si un administrador cambia un precio.
 * Reglas de EP1 conservadas: no duplica productos, no deja superar el stock.
 * -----------------------------------------------------------------------
 */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ItemCarrito, LineaCarrito, Resultado } from "../types";
import { carritoRepo } from "../data/carritoRepo";
import { precioFinal } from "../utils/formato";
import { useDatos } from "./DatosContext";

interface CarritoValor {
  lineas: LineaCarrito[];
  totalItems: number;
  total: number;
  hayProblemasDeStock: boolean;
  agregar: (idProducto: string, cantidad: number) => Resultado;
  cambiarCantidad: (idProducto: string, cantidad: number) => Resultado;
  quitar: (idProducto: string) => void;
  vaciar: () => void;
}

const CarritoContext = createContext<CarritoValor | null>(null);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const { productos } = useDatos();
  const [items, setItems] = useState<ItemCarrito[]>(() => carritoRepo.obtener());

  // Persistencia: cada vez que cambia el carrito se guarda en LocalStorage.
  useEffect(() => {
    carritoRepo.guardar(items);
  }, [items]);

  // Une cada ítem con su producto actual (si el producto fue eliminado, el ítem se descarta).
  const lineas = useMemo<LineaCarrito[]>(
    () =>
      items.flatMap((item) => {
        const producto = productos.find((p) => p.id === item.idProducto);
        if (producto === undefined) return [];
        const precioUnitario = precioFinal(producto);
        return [{ producto, cantidad: item.cantidad, precioUnitario, subtotal: precioUnitario * item.cantidad }];
      }),
    [items, productos],
  );

  const totalItems = lineas.reduce((suma, l) => suma + l.cantidad, 0);
  const total = lineas.reduce((suma, l) => suma + l.subtotal, 0);
  const hayProblemasDeStock = lineas.some((l) => l.cantidad > l.producto.stock);

  function agregar(idProducto: string, cantidad: number): Resultado {
    const producto = productos.find((p) => p.id === idProducto);
    if (producto === undefined) return { ok: false, mensaje: "El producto no existe." };
    if (!Number.isInteger(cantidad) || cantidad < 1) return { ok: false, mensaje: "Ingresa una cantidad válida." };

    const actual = items.find((i) => i.idProducto === idProducto)?.cantidad ?? 0;
    if (actual + cantidad > producto.stock) {
      return { ok: false, mensaje: `No hay stock suficiente. Disponible: ${producto.stock} unidad(es).` };
    }
    setItems((anteriores) =>
      anteriores.some((i) => i.idProducto === idProducto)
        ? anteriores.map((i) => (i.idProducto === idProducto ? { ...i, cantidad: actual + cantidad } : i))
        : [...anteriores, { idProducto, cantidad }],
    );
    return { ok: true, mensaje: "Producto agregado al carrito." };
  }

  /** Cambia la cantidad de un ítem; la limita entre 1 y el stock disponible. */
  function cambiarCantidad(idProducto: string, cantidad: number): Resultado {
    const producto = productos.find((p) => p.id === idProducto);
    if (producto === undefined) return { ok: false, mensaje: "El producto no existe." };
    let nueva = Number.isFinite(cantidad) && cantidad >= 1 ? Math.floor(cantidad) : 1;
    let mensaje = "";
    if (nueva > producto.stock) {
      nueva = producto.stock;
      mensaje = `Solo hay ${producto.stock} unidad(es) disponibles de ${producto.nombre}.`;
    }
    setItems((anteriores) => anteriores.map((i) => (i.idProducto === idProducto ? { ...i, cantidad: nueva } : i)));
    return { ok: mensaje === "", mensaje };
  }

  function quitar(idProducto: string) {
    setItems((anteriores) => anteriores.filter((i) => i.idProducto !== idProducto));
  }

  function vaciar() {
    setItems([]);
  }

  const valor: CarritoValor = { lineas, totalItems, total, hayProblemasDeStock, agregar, cambiarCantidad, quitar, vaciar };
  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito(): CarritoValor {
  const contexto = useContext(CarritoContext);
  if (contexto === null) throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  return contexto;
}
