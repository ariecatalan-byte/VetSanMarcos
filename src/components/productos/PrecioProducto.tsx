import type { Producto } from "../../types";
import { formatearCLP, precioFinal } from "../../utils/formato";

/** Muestra el precio de un producto; si está en oferta, tacha el precio normal y muestra el % de descuento. */
export function PrecioProducto({ producto, grande = false }: { producto: Producto; grande?: boolean }) {
  const enOferta = producto.descuento > 0;
  return (
    <div className="d-flex align-items-baseline flex-wrap gap-2">
      <span className={(grande ? "display-6 " : "") + "producto-precio"}>{formatearCLP(precioFinal(producto))}</span>
      {enOferta && (
        <>
          <span className="text-decoration-line-through text-secondary small">{formatearCLP(producto.precio)}</span>
          <span className="badge text-bg-danger">-{producto.descuento}%</span>
        </>
      )}
    </div>
  );
}
