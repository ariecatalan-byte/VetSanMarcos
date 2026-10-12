/**
 * comunes/Campos.tsx
 * -----------------------------------------------------------------------
 * Campos de formulario reutilizables (INPUTS CONTROLADOS): reciben el valor
 * por props y avisan los cambios con `onCambio`; el estado vive en el
 * formulario padre. Todos los formularios de la app (registro, perfil,
 * productos, categorías, contacto, checkout) usan estos mismos componentes.
 * -----------------------------------------------------------------------
 */
import type { ReactNode } from "react";

interface BaseProps {
  id: string;
  etiqueta: string;
  error?: string;
  ayuda?: string;
}

function Envoltorio({ id, etiqueta, error, ayuda, children }: BaseProps & { children: ReactNode }) {
  return (
    <>
      <label htmlFor={id} className="form-label">{etiqueta}</label>
      {children}
      {ayuda && <div className="form-text">{ayuda}</div>}
      {error && <div className="mensaje-error" role="alert">{error}</div>}
    </>
  );
}

interface CampoInputProps extends BaseProps {
  valor: string;
  onCambio: (valor: string) => void;
  tipo?: "text" | "email" | "password" | "date" | "number" | "range";
  multilinea?: boolean;
  filas?: number;
  maxLength?: number;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export function CampoInput({
  id, etiqueta, error, ayuda, valor, onCambio, tipo = "text", multilinea = false, filas = 3,
  maxLength, placeholder, min, max, step, disabled,
}: CampoInputProps) {
  const clase = (tipo === "range" ? "form-range" : "form-control") + (error ? " is-invalid" : "");
  return (
    <Envoltorio id={id} etiqueta={etiqueta} error={error} ayuda={ayuda}>
      {multilinea ? (
        <textarea id={id} className={clase} rows={filas} value={valor} maxLength={maxLength} placeholder={placeholder}
          disabled={disabled} onChange={(e) => onCambio(e.target.value)} />
      ) : (
        <input id={id} type={tipo} className={clase} value={valor} maxLength={maxLength} placeholder={placeholder}
          min={min} max={max} step={step} disabled={disabled} onChange={(e) => onCambio(e.target.value)} />
      )}
    </Envoltorio>
  );
}

export interface OpcionSelect {
  valor: string;
  etiqueta: string;
}

interface CampoSelectProps extends BaseProps {
  valor: string;
  onCambio: (valor: string) => void;
  opciones: OpcionSelect[];
  placeholder: string;
  disabled?: boolean;
}

export function CampoSelect({ id, etiqueta, error, ayuda, valor, onCambio, opciones, placeholder, disabled }: CampoSelectProps) {
  return (
    <Envoltorio id={id} etiqueta={etiqueta} error={error} ayuda={ayuda}>
      <select id={id} className={"form-select" + (error ? " is-invalid" : "")} value={valor} disabled={disabled}
        onChange={(e) => onCambio(e.target.value)}>
        <option value="" disabled>{placeholder}</option>
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>{o.etiqueta}</option>
        ))}
      </select>
    </Envoltorio>
  );
}

interface CampoCheckProps {
  id: string;
  etiqueta: string;
  marcado: boolean;
  onCambio: (marcado: boolean) => void;
  error?: string;
}

export function CampoCheck({ id, etiqueta, marcado, onCambio, error }: CampoCheckProps) {
  return (
    <>
      <div className="form-check">
        <input id={id} type="checkbox" className={"form-check-input" + (error ? " is-invalid" : "")} checked={marcado}
          onChange={(e) => onCambio(e.target.checked)} />
        <label className="form-check-label" htmlFor={id}>{etiqueta}</label>
      </div>
      {error && <div className="mensaje-error" role="alert">{error}</div>}
    </>
  );
}
