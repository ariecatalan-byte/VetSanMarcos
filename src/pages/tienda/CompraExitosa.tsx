import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ordenesApi } from "../../api/ordenes";
import { Alerta } from "../../components/comunes/Alerta";
import { EstadoCarga } from "../../components/comunes/EstadoCarga";
import { BadgeEstado } from "../../components/comunes/Insignias";
import { ResumenOrden } from "../../components/ordenes/ResumenOrden";
import { useCarga } from "../../hooks/useCarga";
import type { EstadoOrden } from "../../types";

const TITULO: Record<EstadoOrden, string> = {
  pagada: "✅ Se ha realizado la compra.",
  enviada: "🚚 Tu compra va en camino.",
  entregada: "📦 Tu compra fue entregada.",
  cancelada: "🚫 Esta compra fue cancelada.",
  rechazada: "",
};

/** Vista de boleta de una compra del usuario (pagada, enviada, entregada o cancelada). Los datos vienen de GET /ordenes/{id}. */
export function CompraExitosa() {
  const { id } = useParams<{ id: string }>();
  const { datos: orden, cargando, error, recargar } = useCarga(() => ordenesApi.obtener(id ?? ""), [id]);
  const [correoEnviado, setCorreoEnviado] = useState(false);

  return (
    <div className="container py-5" style={{ maxWidth: 900 }}>
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        {orden === null || orden.estado === "rechazada" ? (
          <>
            <Alerta tipo="warning">No se encontró la compra solicitada.</Alerta>
            <Link to="/productos" className="btn btn-primary">Ir al catálogo</Link>
          </>
        ) : (
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h1 className="h3 fw-bold mb-1">{TITULO[orden.estado]} N° #{orden.numero}</h1>
              <p className="mb-3">Estado: <BadgeEstado estado={orden.estado} /></p>
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
        )}
      </EstadoCarga>
    </div>
  );
}
