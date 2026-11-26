/**
 * layout/RutaProtegida.tsx
 * -----------------------------------------------------------------------
 * Guardia de rutas: envuelve una página y solo la muestra si el usuario
 * tiene sesión y (opcionalmente) el permiso requerido por su rol.
 *  - Mientras se restaura la sesión (recarga de página) → muestra un spinner.
 *  - Sin sesión → redirige a /login (y vuelve a la página pedida tras iniciar sesión).
 *  - Con sesión pero sin permiso → muestra "Acceso denegado" (también al escribir la URL a mano).
 * Importante: esto protege la INTERFAZ; el backend valida los permisos de nuevo en cada endpoint.
 * -----------------------------------------------------------------------
 */
import type { ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { puede, type Accion } from "../../utils/permisos";

interface Props {
  permiso?: Accion;
  children: ReactNode;
}

export function RutaProtegida({ permiso, children }: Props) {
  const { usuario, cargandoSesion } = useAuth();
  const ubicacion = useLocation();

  if (cargandoSesion) {
    return (
      <div className="text-center py-5" role="status">
        <div className="spinner-border text-primary" aria-hidden="true" />
        <div className="text-secondary mt-2">Verificando sesión…</div>
      </div>
    );
  }

  if (usuario === null) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;

  if (permiso !== undefined && !puede(usuario.rol, permiso)) {
    return (
      <div className="container py-5 text-center">
        <h1 className="h3 fw-bold">Acceso denegado</h1>
        <p className="text-secondary">Tu rol no tiene permiso para ver esta sección.</p>
        <Link to="/" className="btn btn-primary">Volver al inicio</Link>
      </div>
    );
  }
  return <>{children}</>;
}
