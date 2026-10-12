import { Link, useParams } from "react-router-dom";
import { Alerta } from "../../components/comunes/Alerta";
import { ResumenOrden } from "../../components/ordenes/ResumenOrden";
import { useDatos } from "../../context/DatosContext";

/** Mostrar boleta: detalle de una orden (reutiliza el mismo componente que ve el cliente). */
export function BoletaAdmin() {
  const { id } = useParams<{ id: string }>();
  const { ordenes } = useDatos();
  const orden = ordenes.find((o) => o.id === id);
  return (
    <>
      <Link to="/admin/ordenes" className="btn btn-outline-secondary mb-3 no-imprimir">&larr; Volver a órdenes</Link>
      {orden === undefined ? (
        <Alerta tipo="warning">No se encontró la orden.</Alerta>
      ) : (
        <div className="card border-0 shadow-sm"><div className="card-body p-4">
          <h1 className="h4 fw-bold">Boleta N° #{orden.numero} <span className={`badge ms-2 text-bg-${orden.estado === "pagada" ? "success" : "danger"}`}>{orden.estado === "pagada" ? "Pagada" : "Rechazada"}</span></h1>
          <ResumenOrden orden={orden} />
          <button type="button" className="btn btn-outline-dark mt-3 no-imprimir" onClick={() => window.print()}>Imprimir boleta</button>
        </div></div>
      )}
    </>
  );
}
