import { Link, useParams } from "react-router-dom";
import { Alerta } from "../../components/comunes/Alerta";
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { TablaOrdenes } from "../../components/ordenes/TablaOrdenes";
import { useAuth } from "../../context/AuthContext";
import { useDatos } from "../../context/DatosContext";

/** Historial de compras de un usuario (se llega desde "Mostrar usuarios"). */
export function HistorialUsuario() {
  const { id } = useParams<{ id: string }>();
  const { usuarios } = useAuth();
  const { ordenes } = useDatos();
  const objetivo = usuarios.find((u) => u.id === id);

  return (
    <>
      <EncabezadoPagina titulo="Historial de compras" descripcion={objetivo ? `${objetivo.nombre} ${objetivo.apellido} · ${objetivo.correo}` : undefined}
        acciones={<Link to="/admin/usuarios" className="btn btn-outline-secondary">&larr; Volver</Link>} />
      {objetivo === undefined ? (
        <Alerta tipo="warning">El usuario no existe.</Alerta>
      ) : (
        <TablaOrdenes ordenes={ordenes.filter((o) => o.usuarioId === objetivo.id)} mensajeVacio="Este usuario aún no registra compras."
          rutaDetalle={(o) => `/admin/ordenes/${o.id}`} />
      )}
    </>
  );
}
