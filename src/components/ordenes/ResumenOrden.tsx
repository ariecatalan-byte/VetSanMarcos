/**
 * ordenes/ResumenOrden.tsx
 * Boleta / resumen de una orden: datos del cliente, dirección de entrega,
 * detalle de productos y total. Se reutiliza en "Compra exitosa", "Pago con
 * error" y en la vista de boleta del panel de administración.
 */
import type { Orden } from "../../types";
import { formatearCLP, formatearFecha } from "../../utils/formato";
import { ImagenProducto } from "../comunes/ImagenProducto";

export function ResumenOrden({ orden }: { orden: Orden }) {
  return (
    <div>
      <p className="text-secondary small mb-3">Código orden: {orden.id} · {formatearFecha(orden.fecha)}</p>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <h3 className="h6 fw-bold">Datos del cliente</h3>
          <p className="mb-0">{orden.cliente.nombre} {orden.cliente.apellidos}</p>
          <p className="mb-0 text-secondary">{orden.cliente.correo}</p>
        </div>
        <div className="col-md-6">
          <h3 className="h6 fw-bold">Dirección de entrega</h3>
          <p className="mb-0">{orden.entrega.calle}{orden.entrega.departamento ? `, Depto ${orden.entrega.departamento}` : ""}</p>
          <p className="mb-0 text-secondary">{orden.entrega.comuna}, {orden.entrega.region}</p>
          {orden.entrega.indicaciones && <p className="mb-0 small fst-italic">“{orden.entrega.indicaciones}”</p>}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr><th>Imagen</th><th>Nombre</th><th className="text-end">Precio</th><th className="text-end">Cantidad</th><th className="text-end">Subtotal</th></tr>
          </thead>
          <tbody>
            {orden.lineas.map((l) => (
              <tr key={l.idProducto}>
                <td><ImagenProducto src={l.imagen} alt={l.nombre} className="carrito-item-img" /></td>
                <td>{l.nombre}</td>
                <td className="text-end">{formatearCLP(l.precioUnitario)}</td>
                <td className="text-end">{l.cantidad}</td>
                <td className="text-end">{formatearCLP(l.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card bg-light border-0 text-center p-3">
        <span className="fs-5 fw-bold">{orden.estado === "pagada" ? "Total pagado" : "Total a pagar"}: {formatearCLP(orden.total)}</span>
      </div>
    </div>
  );
}
