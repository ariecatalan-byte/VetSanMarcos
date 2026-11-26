/**
 * Nuevo usuario (/admin/usuarios/nuevo) y Editar usuario (/admin/usuarios/:id/editar).
 * Los roles del select salen de rolesAsignables(): el administrador puede asignar cualquier rol;
 * el vendedor solo puede crear clientes. El servidor vuelve a validar estas reglas.
 */
import { Link, useNavigate, useParams } from "react-router-dom";
import { comoResultado } from "../../api/cliente";
import { usuariosApi } from "../../api/usuarios";
import { Alerta } from "../../components/comunes/Alerta";
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { EstadoCarga } from "../../components/comunes/EstadoCarga";
import { FormUsuario } from "../../components/formularios/FormUsuario";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../data/constantes";
import { useCarga } from "../../hooks/useCarga";
import { puede, rolesAsignables } from "../../utils/permisos";
import { aNuevoUsuario } from "../../utils/usuarios";

export function UsuarioFormulario() {
  const { id } = useParams<{ id: string }>();
  const { usuario } = useAuth();
  const navegar = useNavigate();
  const editando = id !== undefined;
  const esAdmin = puede(usuario?.rol, "usuarios:listar");
  const { datos: objetivo, cargando, error, recargar } = useCarga(() => (editando ? usuariosApi.obtener(id) : Promise.resolve(null)), [id]);

  return (
    <>
      <EncabezadoPagina titulo={editando ? "Editar usuario" : esAdmin ? "Nuevo usuario" : "Nuevo cliente"}
        descripcion={!esAdmin ? "Como vendedor puedes registrar usuarios con rol cliente." : undefined}
        acciones={esAdmin ? <Link to="/admin/usuarios" className="btn btn-outline-secondary">&larr; Volver</Link> : undefined} />
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        {editando && objetivo === null ? (
          <Alerta tipo="warning">El usuario no existe.</Alerta>
        ) : (
          <div className="card border-0 shadow-sm"><div className="card-body p-4">
            {editando && objetivo ? (
              <FormUsuario key={objetivo.id} modo="admin-editar" usuarioInicial={objetivo} rolesDisponibles={ROLES}
                rolBloqueado={objetivo.id === usuario?.id} textoBoton="Guardar cambios"
                onGuardar={(d) => {
                  const { password, ...resto } = aNuevoUsuario(d);
                  return comoResultado(() => usuariosApi.actualizar(objetivo.id, d.password === "" ? resto : { ...resto, password }), "Usuario actualizado correctamente.");
                }}
                onExito={() => setTimeout(() => navegar("/admin/usuarios"), 900)} />
            ) : (
              <FormUsuario modo="admin-crear" rolesDisponibles={rolesAsignables(usuario?.rol)} textoBoton="Crear usuario"
                onGuardar={(d) => comoResultado(() => usuariosApi.crear(aNuevoUsuario(d)), "Usuario creado correctamente.")} />
            )}
          </div></div>
        )}
      </EstadoCarga>
    </>
  );
}
