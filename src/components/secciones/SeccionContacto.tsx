import { FormContacto } from "../formularios/FormContacto";

/** Sección "Contáctanos" (mapa + formulario). Se reutiliza en el Home y en la página /contacto. */
export function SeccionContacto() {
  return (
    <section className="py-5">
      <div className="container">
        <span className="badge text-bg-secondary mb-3">Estamos para ayudarte</span>
        <h2 className="fw-bold mb-4">Contáctanos</h2>
        <div className="row g-4">
          <div className="col-lg-6">
            <iframe className="mapa-contacto" title="Ubicación Vet San Marcos" src="https://www.google.com/maps?q=Rancagua,Chile&output=embed"
              loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <div className="col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4"><FormContacto /></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
