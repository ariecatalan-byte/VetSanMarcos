/**
 * layout/NavbarTienda.tsx
 * Barra de navegación de la tienda (pública). Cambia según la sesión:
 * invitado → Ingresar / Crear cuenta; autenticado → menú de usuario con
 * "Mi perfil", "Panel" (solo administrador y vendedor) y "Cerrar sesión".
 * El menú colapsable (móvil) y el desplegable usan useState, no JS de Bootstrap.
 */
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCarrito } from "../../context/CarritoContext";
import { puede } from "../../utils/permisos";
import { ETIQUETA_ROL } from "../../data/constantes";

const ENLACES = [
  { a: "/", etiqueta: "Inicio", fin: true },
  { a: "/productos", etiqueta: "Productos" },
  { a: "/categorias", etiqueta: "Categorías" },
  { a: "/ofertas", etiqueta: "Ofertas" },
  { a: "/nosotros", etiqueta: "Nosotros" },
  { a: "/blog", etiqueta: "Blog" },
  { a: "/contacto", etiqueta: "Contacto" },
];

export function NavbarTienda() {
  const { usuario, cerrarSesion } = useAuth();
  const { totalItems } = useCarrito();
  const navegar = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuarioAbierto, setUsuarioAbierto] = useState(false);

  const cerrarMenus = () => {
    setMenuAbierto(false);
    setUsuarioAbierto(false);
  };

  function salir() {
    cerrarSesion();
    cerrarMenus();
    navegar("/");
  }

  return (
    <header className="no-imprimir">
      <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/" onClick={cerrarMenus}>
            Vet <span>San Marcos</span>
          </Link>
          <button className="navbar-toggler" type="button" aria-label="Abrir menú" aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto(!menuAbierto)}>
            <span className="navbar-toggler-icon" />
          </button>

          <div className={"navbar-collapse collapse" + (menuAbierto ? " show" : "")}>
            <div className="navbar-nav mx-auto">
              {ENLACES.map((e) => (
                <NavLink key={e.a} to={e.a} end={e.fin} className="nav-link" onClick={cerrarMenus}>{e.etiqueta}</NavLink>
              ))}
            </div>

            <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2">
              <Link to="/carrito" className="btn btn-outline-primary" onClick={cerrarMenus}>
                🛒 Carrito <span className="badge bg-danger rounded-pill ms-1">{totalItems}</span>
              </Link>

              {usuario === null ? (
                <>
                  <Link to="/login" className="btn btn-outline-secondary" onClick={cerrarMenus}>Iniciar sesión</Link>
                  <Link to="/registro" className="btn btn-primary" onClick={cerrarMenus}>Crear cuenta</Link>
                </>
              ) : (
                <div className="dropdown">
                  <button className="btn btn-light border dropdown-toggle" type="button" aria-expanded={usuarioAbierto}
                    onClick={() => setUsuarioAbierto(!usuarioAbierto)}>
                    Hola, {usuario.nombre}
                  </button>
                  <ul className={"dropdown-menu dropdown-menu-lg-end" + (usuarioAbierto ? " show" : "")}>
                    <li><span className="dropdown-item-text small text-secondary">Rol: {ETIQUETA_ROL[usuario.rol]}</span></li>
                    <li><Link className="dropdown-item" to="/perfil" onClick={cerrarMenus}>Mi perfil</Link></li>
                    {puede(usuario.rol, "panel:acceder") && (
                      <li><Link className="dropdown-item" to="/admin" onClick={cerrarMenus}>Panel de gestión</Link></li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" type="button" onClick={salir}>Cerrar sesión</button></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
