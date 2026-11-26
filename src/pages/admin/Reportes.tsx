/**
 * pages/admin/Reportes.tsx — Dashboard de reportes (solo administrador).
 * Todos los indicadores los calcula el backend con las compras reales de la base de datos
 * (GET /reportes/resumen?periodo=...). Se puede consultar por semana, mes, año o todo el historial,
 * y el botón "Actualizar" vuelve a calcularlos para incluir las operaciones recién registradas.
 */
import { useState } from "react";
import { reportesApi } from "../../api/ordenes";
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { EstadoCarga } from "../../components/comunes/EstadoCarga";
import { useCarga } from "../../hooks/useCarga";
import type { PeriodoReporte } from "../../types";
import { formatearCLP } from "../../utils/formato";

const PERIODOS: { valor: PeriodoReporte; etiqueta: string }[] = [
  { valor: "semana", etiqueta: "Últimos 7 días" },
  { valor: "mes", etiqueta: "Últimos 30 días" },
  { valor: "anio", etiqueta: "Último año" },
  { valor: "todo", etiqueta: "Todo" },
];

function Tarjeta({ titulo, valor, color }: { titulo: string; valor: string | number; color: string }) {
  return (
    <div className="col-6 col-xl-3">
      <div className={`card text-bg-${color} border-0 p-3 h-100`}><div className="small">{titulo}</div><div className="fs-4 fw-bold">{valor}</div></div>
    </div>
  );
}

export function Reportes() {
  const [periodo, setPeriodo] = useState<PeriodoReporte>("mes");
  const { datos: r, cargando, error, recargar } = useCarga(() => reportesApi.resumen(periodo), [periodo]);
  const maxMonto = Math.max(1, ...(r?.serie.map((p) => p.monto) ?? [0]));
  const maxCategoria = Math.max(1, ...(r?.ventasPorCategoria.map((c) => c.monto) ?? [0]));

  return (
    <>
      <EncabezadoPagina titulo="Reportes" descripcion="Indicadores de ventas calculados con las compras registradas en la base de datos."
        acciones={<button type="button" className="btn btn-outline-secondary" onClick={recargar}>Actualizar</button>} />

      <div className="btn-group mb-4 flex-wrap" role="group" aria-label="Periodo del reporte">
        {PERIODOS.map((p) => (
          <button key={p.valor} type="button" className={`btn ${periodo === p.valor ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setPeriodo(p.valor)}>{p.etiqueta}</button>
        ))}
      </div>

      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        {r && (
          <>
            <div className="row g-3 mb-4">
              <Tarjeta titulo="Operaciones realizadas" valor={r.totalOperaciones} color="primary" />
              <Tarjeta titulo="Monto total vendido" valor={formatearCLP(r.montoTotal)} color="success" />
              <Tarjeta titulo="Unidades vendidas" valor={r.unidadesVendidas} color="info" />
              <Tarjeta titulo="Ticket promedio" valor={formatearCLP(r.ticketPromedio)} color="warning" />
              <Tarjeta titulo="Compras válidas" valor={r.operacionesPagadas} color="secondary" />
              <Tarjeta titulo="Pagos rechazados" valor={r.operacionesRechazadas} color="danger" />
              <Tarjeta titulo="Compras canceladas" valor={r.operacionesCanceladas} color="dark" />
              <Tarjeta titulo="Productos con stock crítico" valor={`${r.inventario.stockCritico} de ${r.inventario.totalProductos}`} color="danger" />
            </div>

            <div className="card border-0 shadow-sm mb-4"><div className="card-body">
              <h2 className="h5 fw-bold mb-3">Ventas en el tiempo</h2>
              <div className="overflow-auto">
                <div className="d-flex align-items-end gap-1" style={{ height: 180, minWidth: r.serie.length * 28 }} role="img" aria-label="Gráfico de barras de ventas por periodo">
                  {r.serie.map((p) => (
                    <div key={p.etiqueta} className="flex-fill text-center" style={{ minWidth: 24 }} title={`${p.etiqueta}: ${formatearCLP(p.monto)} (${p.operaciones} compra/s)`}>
                      <div className="bg-primary rounded-top" style={{ height: `${Math.max(2, (p.monto / maxMonto) * 150)}px` }} />
                      <div className="small text-secondary" style={{ fontSize: 10 }}>{p.etiqueta}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div></div>

            <div className="row g-4">
              <div className="col-lg-7">
                <div className="card border-0 shadow-sm h-100"><div className="card-body">
                  <h2 className="h5 fw-bold mb-3">Productos más solicitados</h2>
                  {r.topProductos.length === 0 ? <p className="text-secondary mb-0">No hay ventas en este periodo.</p> : (
                    <div className="table-responsive">
                      <table className="table align-middle mb-0">
                        <thead><tr><th>#</th><th>Producto</th><th className="text-end">Unidades</th><th className="text-end">Ingresos</th></tr></thead>
                        <tbody>
                          {r.topProductos.map((p, i) => (
                            <tr key={p.idProducto}><td>{i + 1}</td><td>{p.nombre}</td><td className="text-end">{p.unidades}</td><td className="text-end">{formatearCLP(p.ingresos)}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div></div>
              </div>
              <div className="col-lg-5">
                <div className="card border-0 shadow-sm h-100"><div className="card-body">
                  <h2 className="h5 fw-bold mb-3">Ventas por categoría</h2>
                  {r.ventasPorCategoria.length === 0 ? <p className="text-secondary mb-0">Sin datos.</p> : r.ventasPorCategoria.map((c) => (
                    <div key={c.categoria} className="mb-3">
                      <div className="d-flex justify-content-between small"><span>{c.categoria}</span><span>{formatearCLP(c.monto)}</span></div>
                      <div className="progress" role="progressbar" aria-label={c.categoria} aria-valuenow={c.monto} aria-valuemin={0} aria-valuemax={maxCategoria}>
                        <div className="progress-bar" style={{ width: `${(c.monto / maxCategoria) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div></div>
              </div>
            </div>
          </>
        )}
      </EstadoCarga>
    </>
  );
}
