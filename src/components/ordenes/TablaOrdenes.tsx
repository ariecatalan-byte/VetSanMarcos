import { Link } from "react-router-dom";
import type { Orden } from "../../types";
import { formatearCLP, formatearFecha } from "../../utils/formato";
import { Alerta } from "../comunes/Alerta";

interface Props {
  ordenes: Orden[];
  /** Prefijo de la ruta de detalle (admin: "/admin/ordenes", cliente: "/compra/exitosa"...). */
  rutaDetalle: (orden: Orden) => string;
  mensajeVacio?: string;
}

/** Tabla responsiva de órdenes (la más reciente primero). Reutilizada por Órdenes, Historial de compras y Mis compras. */
export function TablaOrdenes({ ordenes, rutaDetalle, mensajeVacio = "Aún no hay órdenes registradas." }: Props) {
  if (ordenes.length === 0) return <Alerta tipo="light" className="border">{mensajeVacio}</Alerta>;
  const ordenadas = [...ordenes].sort((a, b) => b.numero - a.numero);
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle bg-white">
        <thead>
          <tr><th>N°</th><th>Fecha</th><th>Cliente</th><th>Estado</th><th className="text-end">Total</th><th /></tr>
        </thead>
        <tbody>
          {ordenadas.map((o) => (
            <tr key={o.id}>
              <td>#{o.numero}</td>
              <td>{formatearFecha(o.fecha)}</td>
              <td>{o.cliente.nombre} {o.cliente.apellidos}</td>
              <td><span className={`badge text-bg-${o.estado === "pagada" ? "success" : "danger"}`}>{o.estado === "pagada" ? "Pagada" : "Rechazada"}</span></td>
              <td className="text-end">{formatearCLP(o.total)}</td>
              <td className="text-end"><Link to={rutaDetalle(o)} className="btn btn-sm btn-outline-primary">Ver boleta</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
