import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { comoResultado } from "../../api/cliente";
import { ordenesApi } from "../../api/ordenes";
import { Alerta } from "../../components/comunes/Alerta";
import { EstadoCarga } from "../../components/comunes/EstadoCarga";
import { BadgeEstado } from "../../components/comunes/Insignias";
import { ResumenOrden } from "../../components/ordenes/ResumenOrden";
import { useCarga } from "../../hooks/useCarga";
import type { EstadoOrden, Resultado } from "../../types";
import { ESTADO_ORDEN, TRANSICIONES } from "../../utils/ordenes";

/** Boleta de una orden (administrador): detalle + actualización del estado (pagada → enviada → entregada, o cancelada). */
export function BoletaAdmin() {
  const { id } = useParams<{ id: string }>();
  const { datos: orden, setDatos, cargando, error, recargar } = useCarga(() => ordenesApi.obtener(id ?? ""), [id]);
  const [aviso, setAviso] = useState<Resultado | null>(null);
  const [cambiando, setCambiando] = useState(false);

  async function cambiarEstado(nuevo: EstadoOrden) {
    if (!orden) return;
    if (nuevo === "cancelada" && !window.confirm("¿Cancelar esta orden? Se devolverá el stock de los productos.")) return;
    setCambiando(true);
    const resultado = await comoResultado(async () => setDatos(await ordenesApi.cambiarEstado(orden.id, nuevo)), `Orden actualizada a "${ESTADO_ORDEN[nuevo].etiqueta}".`);
    setAviso(resultado);
    setCambiando(false);
  }

  return (
    <>
      <Link to="/admin/ordenes" className="btn btn-outline-secondary mb-3 no-imprimir">&larr; Volver a órdenes</Link>
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        {orden === null ? (
          <Alerta tipo="warning">No se encontró la orden.</Alerta>
        ) : (
          <div className="card border-0 shadow-sm"><div className="card-body p-4">
            <h1 className="h4 fw-bold">Boleta N° #{orden.numero} <span className="ms-2"><BadgeEstado estado={orden.estado} /></span></h1>

            <div className="no-imprimir my-3">
              {aviso && <Alerta tipo={aviso.ok ? "success" : "danger"} onCerrar={() => setAviso(null)}>{aviso.mensaje}</Alerta>}
              {TRANSICIONES[orden.estado].length > 0 ? (
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <span className="text-secondary">Cambiar estado a:</span>
                  {TRANSICIONES[orden.estado].map((e) => (
                    <button key={e} type="button" disabled={cambiando} className={`btn btn-sm btn-outline-${ESTADO_ORDEN[e].color === "secondary" ? "danger" : ESTADO_ORDEN[e].color}`}
                      onClick={() => void cambiarEstado(e)}>{ESTADO_ORDEN[e].etiqueta}</button>
                  ))}
                </div>
              ) : (
                <p className="text-secondary small mb-0">Esta orden está en un estado final: no admite más cambios.</p>
              )}
            </div>

            <ResumenOrden orden={orden} />
            <button type="button" className="btn btn-outline-dark mt-3 no-imprimir" onClick={() => window.print()}>Imprimir boleta</button>
          </div></div>
        )}
      </EstadoCarga>
    </>
  );
}
