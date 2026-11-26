import type { EstadoOrden, Orden } from "../types";

/** Etiqueta y color (Bootstrap) de cada estado de una orden. */
export const ESTADO_ORDEN: Record<EstadoOrden, { etiqueta: string; color: string }> = {
  pagada: { etiqueta: "Pagada", color: "success" },
  enviada: { etiqueta: "Enviada", color: "info" },
  entregada: { etiqueta: "Entregada", color: "primary" },
  cancelada: { etiqueta: "Cancelada", color: "secondary" },
  rechazada: { etiqueta: "Rechazada", color: "danger" },
};

/** Cambios de estado permitidos (el backend aplica la misma regla). */
export const TRANSICIONES: Record<EstadoOrden, EstadoOrden[]> = {
  pagada: ["enviada", "cancelada"],
  enviada: ["entregada", "cancelada"],
  entregada: [],
  cancelada: [],
  rechazada: [],
};

/** Ruta de la boleta que ve el CLIENTE: un pago rechazado tiene su propia vista. */
export const rutaBoletaCliente = (o: Pick<Orden, "id" | "estado">): string =>
  o.estado === "rechazada" ? `/compra/error/${o.id}` : `/compra/exitosa/${o.id}`;
