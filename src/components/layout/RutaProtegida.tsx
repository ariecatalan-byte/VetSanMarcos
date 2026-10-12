/**
 * layout/RutaProtegida.tsx
 * -----------------------------------------------------------------------
 * Guardia de rutas: envuelve una página y solo la muestra si el usuario
 * tiene sesión y (opcionalmente) el permiso requerido por su rol.
 *  - Sin sesión → redirige a /login.
 *  - Con sesión pero sin permiso → muestra "Acceso denegado".
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
  const { usuario } = useAuth();
  const ubicacion = useLocation();

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
