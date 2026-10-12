import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Alerta } from "../../components/comunes/Alerta";
import { ResumenOrden } from "../../components/ordenes/ResumenOrden";
import { useDatos } from "../../context/DatosContext";

/** Vista "Compra exitosa": resumen/boleta de la orden pagada. */
export function CompraExitosa() {
  const { id } = useParams<{ id: string }>();
  const { ordenes } = useDatos();
  const [correoEnviado, setCorreoEnviado] = useState(false);
  const orden = ordenes.find((o) => o.id === id && o.estado === "pagada");

  if (orden === undefined) {
    return (
      <div className="container py-5">
        <Alerta tipo="warning">No se encontró la compra solicitada.</Alerta>
        <Link to="/productos" className="btn btn-primary">Ir al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: 900 }}>
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h1 className="h3 fw-bold text-success mb-3">✅ Se ha realizado la compra. N° #{orden.numero}</h1>
          <ResumenOrden orden={orden} />
          <div className="d-flex flex-wrap justify-content-center gap-2 mt-4 no-imprimir">
            <button type="button" className="btn btn-danger" onClick={() => window.print()}>Imprimir boleta en PDF</button>
            <button type="button" className="btn btn-success" onClick={() => setCorreoEnviado(true)}>Enviar boleta por email</button>
            <Link to="/productos" className="btn btn-outline-primary">Seguir comprando</Link>
          </div>
          {correoEnviado && (
            <Alerta tipo="success" className="mt-3 mb-0 no-imprimir" onCerrar={() => setCorreoEnviado(false)}>
              Simulación: la boleta fue enviada a {orden.cliente.correo}.
            </Alerta>
          )}
        </div>
      </div>
    </div>
  );
}
