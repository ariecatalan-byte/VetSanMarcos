/**
 * layout/LayoutAdmin.tsx
 * Estructura del panel de gestión: barra lateral + contenido. Las opciones
 * del menú se FILTRAN según el permiso del rol: el vendedor solo ve lo que
 * puede hacer (productos/stock y crear clientes). En móvil la barra lateral
 * pasa a ser un menú colapsable (clases responsivas de Bootstrap).
 */
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ETIQUETA_ROL } from "../../data/constantes";
import { puede, type Accion } from "../../utils/permisos";
import { FooterTienda } from "./FooterTienda";

interface Opcion {
  a: string;
  etiqueta: string;
  permiso: Accion;
  fin?: boolean;
}

const OPCIONES: Opcion[] = [
  { a: "/admin", etiqueta: "📊 Dashboard", permiso: "panel:acceder", fin: true },
  { a: "/admin/ordenes", etiqueta: "🧾 Órdenes / Boletas", permiso: "ordenes:ver" },
  { a: "/admin/productos", etiqueta: "📦 Productos", permiso: "productos:ver" },
  { a: "/admin/categorias", etiqueta: "🏷️ Categorías", permiso: "categorias:gestionar" },
  { a: "/admin/usuarios", etiqueta: "👥 Usuarios", permiso: "usuarios:listar" },
  { a: "/admin/usuarios/nuevo", etiqueta: "➕ Nuevo cliente", permiso: "usuarios:crear" },
  { a: "/admin/reportes", etiqueta: "📈 Reportes", permiso: "reportes:ver" },
];

export function LayoutAdmin() {
  const { usuario, cerrarSesion } = useAuth();
  const navegar = useNavigate();
  const [abierto, setAbierto] = useState(false);
  if (usuario === null) return null;

  // El administrador ya tiene "Usuarios" (que incluye crear); el vendedor solo ve "Nuevo cliente".
  const visibles = OPCIONES.filter(
    (o) => puede(usuario.rol, o.permiso) && !(o.a === "/admin/usuarios/nuevo" && puede(usuario.rol, "usuarios:listar")),
  );

  function salir() {
    cerrarSesion();
    navegar("/");
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="bg-dark text-white no-imprimir">
        <div className="container-fluid d-flex align-items-center justify-content-between py-2">
          <span className="fw-bold">🐾 Vet San Marcos · Panel</span>
          <div className="d-flex align-items-center gap-3">
            <span className="small d-none d-sm-inline">{usuario.nombre} · {ETIQUETA_ROL[usuario.rol]}</span>
            <button className="btn btn-outline-light btn-sm d-lg-none" type="button" aria-expanded={abierto}
              onClick={() => setAbierto(!abierto)}>
              ☰ Menú
            </button>
          </div>
        </div>
      </header>

      <div className="container-fluid flex-grow-1">
        <div className="row">
          <aside className={"col-lg-2 bg-white border-end p-3 no-imprimir " + (abierto ? "" : "d-none d-lg-block")}>
            <nav className="nav nav-pills flex-column gap-1">
              {visibles.map((o) => (
                <NavLink key={o.a} to={o.a} end={o.fin} className="nav-link" onClick={() => setAbierto(false)}>{o.etiqueta}</NavLink>
              ))}
              <hr />
              <NavLink to="/perfil" className="nav-link" onClick={() => setAbierto(false)}>👤 Mi perfil</NavLink>
              <Link to="/" className="btn btn-dark btn-sm mt-2">🏪 Ir a la tienda</Link>
              <button type="button" className="btn btn-danger btn-sm mt-2" onClick={salir}>Cerrar sesión</button>
            </nav>
          </aside>
          <section className="col-lg-10 p-3 p-md-4">
            <Outlet />
          </section>
        </div>
      </div>
      <FooterTienda />
    </div>
  );
}
