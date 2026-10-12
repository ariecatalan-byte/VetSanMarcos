import type { ReactNode } from "react";

interface Props {
  insignia?: string;
  titulo: string;
  descripcion?: string;
  acciones?: ReactNode;
}

/** Cabecera estándar de cada página: insignia, título, descripción y botones de acción. */
export function EncabezadoPagina({ insignia, titulo, descripcion, acciones }: Props) {
  return (
    <section className="mb-4 d-flex flex-wrap justify-content-between align-items-end gap-3">
      <div>
        {insignia && <span className="badge text-bg-primary mb-2">{insignia}</span>}
        <h1 className="fw-bold h2 mb-1">{titulo}</h1>
        {descripcion && <p className="text-secondary mb-0">{descripcion}</p>}
      </div>
      {acciones && <div className="d-flex gap-2 flex-wrap">{acciones}</div>}
    </section>
  );
}
