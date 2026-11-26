import { Link, useParams } from "react-router-dom";
import { ordenesApi } from "../../api/ordenes";
import { usuariosApi } from "../../api/usuarios";
import { Alerta } from "../../components/comunes/Alerta";
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { EstadoCarga } from "../../components/comunes/EstadoCarga";
import { TablaOrdenes } from "../../components/ordenes/TablaOrdenes";
import { useCarga } from "../../hooks/useCarga";

/** Historial de compras de un usuario (administrador). Se llega desde "Usuarios". */
export function HistorialUsuario() {
  const { id } = useParams<{ id: string }>();
  const { datos, cargando, error, recargar } = useCarga(
    async () => {
      const [objetivo, ordenes] = await Promise.all([usuariosApi.obtener(id ?? ""), ordenesApi.todas(id)]);
      return { objetivo, ordenes };
    },
    [id],
  );
  const objetivo = datos?.objetivo;

  return (
    <>
      <EncabezadoPagina titulo="Historial de compras" descripcion={objetivo ? `${objetivo.nombre} ${objetivo.apellido} · ${objetivo.correo}` : undefined}
        acciones={<Link to="/admin/usuarios" className="btn btn-outline-secondary">&larr; Volver</Link>} />
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        {datos === null ? (
          <Alerta tipo="warning">El usuario no existe.</Alerta>
        ) : (
          <TablaOrdenes ordenes={datos.ordenes} mensajeVacio="Este usuario aún no registra compras." rutaDetalle={(o) => `/admin/ordenes/${o.id}`} />
        )}
      </EstadoCarga>
    </>
  );
}
