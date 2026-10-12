/**
 * pages/tienda/Perfil.tsx — Perfil personal (TODOS los roles).
 * Permite consultar y editar nombre completo, fecha de nacimiento (con la
 * edad derivada), correo, dirección y región/comuna. Muestra el rol pero
 * no permite modificarlo. Incluye el historial de compras del usuario.
 */
import { Avatar } from "../../components/comunes/Avatar";
import { BadgeRol } from "../../components/comunes/Insignias";
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { FormUsuario } from "../../components/formularios/FormUsuario";
import { TablaOrdenes } from "../../components/ordenes/TablaOrdenes";
import { useAuth } from "../../context/AuthContext";
import { useDatos } from "../../context/DatosContext";
import { calcularEdad } from "../../utils/validaciones";

export function Perfil() {
  const { usuario, usuarios, actualizarPerfil } = useAuth();
  const { ordenes } = useDatos();
  if (usuario === null) return null; // la ruta ya está protegida; esto solo satisface a TypeScript

  const misOrdenes = ordenes.filter((o) => o.usuarioId === usuario.id);

  return (
    <div className="container py-5">
      <EncabezadoPagina insignia="Mi cuenta" titulo="Mi perfil" descripcion="Consulta y actualiza tus datos personales." />
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm text-center p-4">
            <div className="d-flex justify-content-center mb-3"><Avatar nombre={usuario.nombre} apellido={usuario.apellido} /></div>
            <h2 className="h5 fw-bold mb-1">{usuario.nombre} {usuario.apellido}</h2>
            <p className="text-secondary mb-2">{usuario.correo}</p>
            <div className="mb-2"><BadgeRol rol={usuario.rol} /></div>
            <p className="small mb-0">Edad: {calcularEdad(usuario.fechaNacimiento) ?? "—"} años</p>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              {/* key: si cambia el usuario, el formulario se reinicia con sus datos */}
              <FormUsuario key={usuario.id} modo="perfil" usuarioInicial={usuario} usuarios={usuarios} textoBoton="Guardar cambios"
                onGuardar={(d) =>
                  actualizarPerfil({
                    nombre: d.nombre.trim(), apellido: d.apellido.trim(), fechaNacimiento: d.fechaNacimiento,
                    genero: d.genero === "" ? usuario.genero : d.genero, correo: d.correo.trim(), direccion: d.direccion.trim(),
                    region: d.region, comuna: d.comuna,
                  })} />
            </div>
          </div>
        </div>
      </div>

      <h2 className="h4 fw-bold mt-5 mb-3">Mis compras</h2>
      <TablaOrdenes ordenes={misOrdenes} mensajeVacio="Aún no has realizado compras."
        rutaDetalle={(o) => (o.estado === "pagada" ? `/compra/exitosa/${o.id}` : `/compra/error/${o.id}`)} />
    </div>
  );
}
