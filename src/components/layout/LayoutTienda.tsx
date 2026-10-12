import { Outlet } from "react-router-dom";
import { FooterTienda } from "./FooterTienda";
import { NavbarTienda } from "./NavbarTienda";

/** Estructura común de todas las páginas públicas: navbar + contenido (<Outlet/>) + footer. */
export function LayoutTienda() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarTienda />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <FooterTienda />
    </div>
  );
}
