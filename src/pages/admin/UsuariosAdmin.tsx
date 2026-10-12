/** Mostrar usuarios (solo administrador): tabla con editar, historial de compras, desbloquear y eliminar. */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Alerta } from "../../components/comunes/Alerta";
import { CampoInput, CampoSelect } from "../../components/comunes/Campos";
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { BadgeRol } from "../../components/comunes/Insignias";
import { useAuth } from "../../context/AuthContext";
import { ETIQUETA_ROL, ROLES } from "../../data/constantes";
import type { Resultado, Rol } from "../../types";
import { calcularEdad } from "../../utils/validaciones";

export function UsuariosAdmin() {
  const { usuario, usuarios, eliminarUsuario, estaBloqueado, desbloquear } = useAuth();
  const [texto, setTexto] = useState("");
  const [rol, setRol] = useState<Rol | "">("");
  const [aviso, setAviso] = useState<Resultado | null>(null);

  const filtrados = usuarios.filter(
    (u) => (rol === "" || u.rol === rol) && `${u.nombre} ${u.apellido} ${u.correo}`.toLowerCase().includes(texto.trim().toLowerCase()),
  );

  function eliminar(id: string, correo: string) {
    if (window.confirm(`¿Eliminar al usuario ${correo}?`)) setAviso(eliminarUsuario(id));
  }

  return (
    <>
      <EncabezadoPagina titulo="Usuarios" descripcion="Gestión de cuentas de usuario y sus roles."
        acciones={<Link to="/admin/usuarios/nuevo" className="btn btn-primary">+ Nuevo usuario</Link>} />
      {aviso && <Alerta tipo={aviso.ok ? "success" : "danger"} onCerrar={() => setAviso(null)}>{aviso.mensaje}</Alerta>}

      <div className="row g-3 mb-3">
        <div className="col-md-6"><CampoInput id="buscarUsuario" etiqueta="Buscar (nombre o correo)" valor={texto} onCambio={setTexto} /></div>
        <div className="col-md-4">
          <CampoSelect id="filtroRol" etiqueta="Rol" placeholder="Todos" valor={rol} opciones={ROLES.map((r) => ({ valor: r, etiqueta: ETIQUETA_ROL[r] }))}
            onCambio={(v) => setRol(v as Rol | "")} />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle bg-white">
          <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Edad</th><th>Estado</th><th /></tr></thead>
          <tbody>
            {filtrados.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre} {u.apellido}{u.id === usuario?.id && <span className="badge text-bg-light text-dark ms-2">Tú</span>}</td>
                <td>{u.correo}</td>
                <td><BadgeRol rol={u.rol} /></td>
                <td>{calcularEdad(u.fechaNacimiento) ?? "—"}</td>
                <td>{estaBloqueado(u.correo) ? <span className="badge text-bg-danger">Bloqueada</span> : <span className="badge text-bg-success">Activa</span>}</td>
                <td className="text-end text-nowrap">
                  <Link to={`/admin/usuarios/${u.id}/historial`} className="btn btn-sm btn-outline-secondary me-1">Historial</Link>
                  <Link to={`/admin/usuarios/${u.id}/editar`} className="btn btn-sm btn-outline-primary me-1">Editar</Link>
                  {estaBloqueado(u.correo) && <button type="button" className="btn btn-sm btn-outline-warning me-1" onClick={() => setAviso(desbloquear(u.correo))}>Desbloquear</button>}
                  <button type="button" className="btn btn-sm btn-outline-danger" disabled={u.id === usuario?.id} onClick={() => eliminar(u.id, u.correo)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
