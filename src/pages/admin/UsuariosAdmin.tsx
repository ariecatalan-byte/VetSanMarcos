/** Usuarios (solo administrador): tabla alimentada por GET /usuarios, con editar, historial, desbloquear y eliminar/desactivar. */
import { useState } from "react";
import { Link } from "react-router-dom";
import { comoResultado } from "../../api/cliente";
import { usuariosApi } from "../../api/usuarios";
import { Alerta } from "../../components/comunes/Alerta";
import { CampoInput, CampoSelect } from "../../components/comunes/Campos";
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { EstadoCarga } from "../../components/comunes/EstadoCarga";
import { BadgeRol } from "../../components/comunes/Insignias";
import { useAuth } from "../../context/AuthContext";
import { ETIQUETA_ROL, ROLES } from "../../data/constantes";
import { useCarga } from "../../hooks/useCarga";
import type { Resultado, Rol } from "../../types";
import { calcularEdad } from "../../utils/validaciones";

export function UsuariosAdmin() {
  const { usuario } = useAuth();
  const { datos, cargando, error, recargar } = useCarga(() => usuariosApi.listar(), []);
  const [texto, setTexto] = useState("");
  const [rol, setRol] = useState<Rol | "">("");
  const [aviso, setAviso] = useState<Resultado | null>(null);

  const filtrados = (datos ?? []).filter(
    (u) => (rol === "" || u.rol === rol) && `${u.nombre} ${u.apellido} ${u.correo}`.toLowerCase().includes(texto.trim().toLowerCase()),
  );

  async function eliminar(id: string, correo: string) {
    if (!window.confirm(`¿Eliminar al usuario ${correo}? Si ya tiene compras, su cuenta quedará desactivada para conservar el historial.`)) return;
    const r = await comoResultado(() => usuariosApi.eliminar(id), "Usuario eliminado (o desactivado si tenía compras).");
    setAviso(r);
    if (r.ok) recargar();
  }

  async function desbloquear(id: string) {
    const r = await comoResultado(() => usuariosApi.desbloquear(id), "Cuenta desbloqueada.");
    setAviso(r);
    if (r.ok) recargar();
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

      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
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
                  <td>
                    {!u.activo ? <span className="badge text-bg-secondary">Desactivada</span>
                      : u.bloqueado ? <span className="badge text-bg-danger">Bloqueada</span>
                      : <span className="badge text-bg-success">Activa</span>}
                  </td>
                  <td className="text-end text-nowrap">
                    <Link to={`/admin/usuarios/${u.id}/historial`} className="btn btn-sm btn-outline-secondary me-1">Historial</Link>
                    <Link to={`/admin/usuarios/${u.id}/editar`} className="btn btn-sm btn-outline-primary me-1">Editar</Link>
                    {u.bloqueado && <button type="button" className="btn btn-sm btn-outline-warning me-1" onClick={() => void desbloquear(u.id)}>Desbloquear</button>}
                    <button type="button" className="btn btn-sm btn-outline-danger" disabled={u.id === usuario?.id || !u.activo} onClick={() => void eliminar(u.id, u.correo)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EstadoCarga>
    </>
  );
}
