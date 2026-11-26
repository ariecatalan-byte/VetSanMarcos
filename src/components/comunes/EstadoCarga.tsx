import type { ReactNode } from "react";
import { Alerta } from "./Alerta";

interface Props {
  cargando: boolean;
  error: string;
  onReintentar?: () => void;
  children: ReactNode;
}

/** Muestra spinner mientras se piden datos a la API, el error (con botón Reintentar) si falla, o el contenido. */
export function EstadoCarga({ cargando, error, onReintentar, children }: Props) {
  if (cargando) {
    return (
      <div className="text-center py-5" role="status" aria-live="polite">
        <div className="spinner-border text-primary" aria-hidden="true" />
        <div className="text-secondary mt-2">Cargando…</div>
      </div>
    );
  }
  if (error) {
    return (
      <Alerta tipo="danger">
        <div>{error}</div>
        {onReintentar && <button type="button" className="btn btn-sm btn-outline-danger mt-2" onClick={onReintentar}>Reintentar</button>}
      </Alerta>
    );
  }
  return <>{children}</>;
}
