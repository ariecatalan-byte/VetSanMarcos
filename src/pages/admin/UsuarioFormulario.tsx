/**
 * Nuevo usuario (/admin/usuarios/nuevo) y Editar usuario (/admin/usuarios/:id/editar).
 * Los roles que aparecen en el select salen de rolesAsignables(): el administrador
 * puede asignar cualquier rol; el vendedor solo puede crear clientes.
 */
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alerta } from "../../components/comunes/Alerta";
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { FormUsuario } from "../../components/formularios/FormUsuario";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../data/constantes";
import { puede, rolesAsignables } from "../../utils/permisos";
import { aNuevoUsuario } from "../../utils/usuarios";

export function UsuarioFormulario() {
  const { id } = useParams<{ id: string }>();
  const { usuario, usuarios, crearUsuario, actualizarUsuario } = useAuth();
  const navegar = useNavigate();
  const editando = id !== undefined;
  const objetivo = usuarios.find((u) => u.id === id);
  const esAdmin = puede(usuario?.rol, "usuarios:listar");

  return (
    <>
      <EncabezadoPagina titulo={editando ? "Editar usuario" : esAdmin ? "Nuevo usuario" : "Nuevo cliente"}
        descripcion={!esAdmin ? "Como vendedor puedes registrar usuarios con rol cliente." : undefined}
        acciones={esAdmin ? <Link to="/admin/usuarios" className="btn btn-outline-secondary">&larr; Volver</Link> : undefined} />
      {editando && objetivo === undefined ? (
        <Alerta tipo="warning">El usuario no existe.</Alerta>
      ) : (
        <div className="card border-0 shadow-sm"><div className="card-body p-4">
          {editando && objetivo ? (
            <FormUsuario key={objetivo.id} modo="admin-editar" usuarioInicial={objetivo} usuarios={usuarios} rolesDisponibles={ROLES}
              rolBloqueado={objetivo.id === usuario?.id} textoBoton="Guardar cambios"
              onGuardar={(d) => {
                const { password, ...resto } = aNuevoUsuario(d);
                return actualizarUsuario(objetivo.id, d.password === "" ? resto : { ...resto, password });
              }}
              onExito={() => setTimeout(() => navegar("/admin/usuarios"), 900)} />
          ) : (
            <FormUsuario modo="admin-crear" usuarios={usuarios} rolesDisponibles={rolesAsignables(usuario?.rol)} textoBoton="Crear usuario"
              onGuardar={(d) => crearUsuario(aNuevoUsuario(d))} />
          )}
        </div></div>
      )}
    </>
  );
}
