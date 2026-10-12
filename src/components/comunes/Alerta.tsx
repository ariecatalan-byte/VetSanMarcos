import type { ReactNode } from "react";

interface AlertaProps {
  tipo: "success" | "danger" | "warning" | "info" | "light";
  children: ReactNode;
  onCerrar?: () => void;
  className?: string;
}

/** Mensaje de resultado/estado con el componente "alert" de Bootstrap. */
export function Alerta({ tipo, children, onCerrar, className = "" }: AlertaProps) {
  return (
    <div className={`alert alert-${tipo} ${onCerrar ? "d-flex justify-content-between align-items-start" : ""} ${className}`} role="alert">
      <div>{children}</div>
      {onCerrar && <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar} />}
    </div>
  );
}
