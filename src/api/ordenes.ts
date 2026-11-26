import type { DatosCliente, DireccionEntrega, EstadoOrden, Orden, PeriodoReporte, ReporteResumen } from "../types";
import { http } from "./cliente";

export interface SolicitudOrden {
  /** Solo id y cantidad: el servidor calcula precios y totales. */
  lineas: { idProducto: string; cantidad: number }[];
  cliente: DatosCliente;
  entrega: DireccionEntrega;
  /** El pago es una simulación académica: aprobado / rechazado. */
  pagoAprobado: boolean;
}

export const ordenesApi = {
  crear: (d: SolicitudOrden) => http.post<Orden>("/ordenes", d),
  mias: () => http.get<Orden[]>("/ordenes/mis"),
  todas: (usuarioId?: string) => http.get<Orden[]>(usuarioId ? `/ordenes?usuarioId=${encodeURIComponent(usuarioId)}` : "/ordenes"),
  obtener: (id: string) => http.get<Orden>(`/ordenes/${id}`),
  cambiarEstado: (id: string, estado: EstadoOrden) => http.patch<Orden>(`/ordenes/${id}/estado`, { estado }),
};

export const reportesApi = {
  resumen: (periodo: PeriodoReporte) => http.get<ReporteResumen>(`/reportes/resumen?periodo=${periodo}`),
};
