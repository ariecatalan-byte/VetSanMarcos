import type { Producto, Rol } from "../../types";
import { ETIQUETA_ROL } from "../../data/constantes";

const COLOR_ROL: Record<Rol, string> = { administrador: "danger", vendedor: "warning", cliente: "primary" };

/** Insignia con el rol del usuario. */
export function BadgeRol({ rol }: { rol: Rol }) {
  return <span className={`badge text-bg-${COLOR_ROL[rol]}`}>{ETIQUETA_ROL[rol]}</span>;
}

/** Estado del stock de un producto: En stock / Últimas unidades / Sin stock. */
export function EstadoStock({ producto }: { producto: Pick<Producto, "stock" | "stockCritico"> }) {
  if (producto.stock === 0) return <span className="stock-agotado small">Sin stock</span>;
  if (producto.stock <= producto.stockCritico) return <span className="stock-bajo small">¡Últimas {producto.stock} unidades!</span>;
  return <span className="text-success small">En stock</span>;
}
