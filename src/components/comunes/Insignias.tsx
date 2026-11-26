import type { EstadoOrden, Producto, Rol } from "../../types";
import { ETIQUETA_ROL } from "../../data/constantes";
import { ESTADO_ORDEN } from "../../utils/ordenes";

const COLOR_ROL: Record<Rol, string> = { administrador: "danger", vendedor: "warning", cliente: "primary" };

/** Insignia con el rol del usuario. */
export function BadgeRol({ rol }: { rol: Rol }) {
  return <span className={`badge text-bg-${COLOR_ROL[rol]}`}>{ETIQUETA_ROL[rol]}</span>;
}

/** Insignia con el estado de una orden (pagada, enviada, entregada, cancelada, rechazada). */
export function BadgeEstado({ estado }: { estado: EstadoOrden }) {
  const { etiqueta, color } = ESTADO_ORDEN[estado];
  return <span className={`badge text-bg-${color}`}>{etiqueta}</span>;
}

/** Estado del stock de un producto: En stock / Últimas unidades / Sin stock. */
export function EstadoStock({ producto }: { producto: Pick<Producto, "stock" | "stockCritico"> }) {
  if (producto.stock === 0) return <span className="stock-agotado small">Sin stock</span>;
  if (producto.stock <= producto.stockCritico) return <span className="stock-bajo small">¡Últimas {producto.stock} unidades!</span>;
  return <span className="text-success small">En stock</span>;
}
