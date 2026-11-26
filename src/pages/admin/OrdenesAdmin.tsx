import { ordenesApi } from "../../api/ordenes";
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { EstadoCarga } from "../../components/comunes/EstadoCarga";
import { TablaOrdenes } from "../../components/ordenes/TablaOrdenes";
import { useCarga } from "../../hooks/useCarga";

/** Órdenes / Boletas (solo administrador): todas las compras e intentos de pago, leídas desde la base de datos (GET /ordenes). */
export function OrdenesAdmin() {
  const { datos, cargando, error, recargar } = useCarga(() => ordenesApi.todas(), []);
  return (
    <>
      <EncabezadoPagina titulo="Órdenes / Boletas" descripcion="Todas las compras realizadas en la tienda."
        acciones={<button type="button" className="btn btn-outline-secondary" onClick={recargar}>Actualizar</button>} />
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        <TablaOrdenes ordenes={datos ?? []} rutaDetalle={(o) => `/admin/ordenes/${o.id}`} />
      </EstadoCarga>
    </>
  );
}
