import { Link, Outlet } from "react-router-dom";
import { Alerta } from "../comunes/Alerta";
import { useAuth } from "../../context/AuthContext";
import { useDatos } from "../../context/DatosContext";
import { FooterTienda } from "./FooterTienda";
import { NavbarTienda } from "./NavbarTienda";

/** Estructura común de todas las páginas públicas: navbar + contenido (<Outlet/>) + footer. */
export function LayoutTienda() {
  const { error, recargar } = useDatos();
  const { sesionExpirada, usuario } = useAuth();
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarTienda />
      <main className="flex-grow-1">
        {error && (
          <div className="container pt-3">
            <Alerta tipo="danger" className="mb-0">
              {error} <button type="button" className="btn btn-sm btn-outline-danger ms-2" onClick={() => void recargar()}>Reintentar</button>
            </Alerta>
          </div>
        )}
        {sesionExpirada && usuario === null && (
          <div className="container pt-3">
            <Alerta tipo="warning" className="mb-0">Tu sesión expiró. <Link to="/login">Inicia sesión nuevamente</Link>.</Alerta>
          </div>
        )}
        <Outlet />
      </main>
      <FooterTienda />
    </div>
  );
}
