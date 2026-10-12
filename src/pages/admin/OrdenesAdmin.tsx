import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { TablaOrdenes } from "../../components/ordenes/TablaOrdenes";
import { useDatos } from "../../context/DatosContext";

/** Órdenes / Boletas (solo administrador): listado de todas las compras e intentos de pago. */
export function OrdenesAdmin() {
  const { ordenes } = useDatos();
  return (
    <>
      <EncabezadoPagina titulo="Órdenes / Boletas" descripcion="Todas las compras realizadas en la tienda." />
      <TablaOrdenes ordenes={ordenes} rutaDetalle={(o) => `/admin/ordenes/${o.id}`} />
    </>
  );
}
