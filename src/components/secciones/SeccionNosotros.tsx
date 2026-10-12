/** Sección "Quiénes somos". Se reutiliza en el Home y en la página /nosotros. */
export function SeccionNosotros() {
  return (
    <section className="bg-white py-5">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <span className="badge text-bg-secondary mb-3">Nuestro equipo</span>
            <h2 className="fw-bold mb-3">Quiénes somos</h2>
            <p>
              Vet San Marcos nace como proyecto académico del equipo formado por <strong>Ariel Catalán</strong> y{" "}
              <strong>Vinc González</strong>, para la asignatura <strong>Desarrollo FullStack II (DSY1104)</strong> de Duoc UC,
              inspirado en la experiencia real de la Veterinaria San Marcos. Nuestro objetivo es acercar a los dueños de
              mascotas los medicamentos, alimentos y accesorios que habitualmente encuentran en la clínica veterinaria, ahora
              en una tienda online simple y rápida de usar.
            </p>
            <p>
              Creemos que cuidar a una mascota no debería significar perder tiempo buscando en distintas tiendas físicas: por
              eso reunimos en un solo lugar antibióticos y antiparasitarios de uso frecuente, alimento balanceado y accesorios
              básicos, con información clara de precio, categoría y disponibilidad de stock.
            </p>
          </div>
          <div className="col-lg-6">
            <div className="row g-3">
              <div className="col-6">
                <div className="card border-0 shadow-sm p-4 text-center h-100">
                  <div className="display-6">🐾</div>
                  <p className="fw-bold mb-0 mt-2">+2.500 mascotas</p>
                  <p className="text-secondary small mb-0">atendidas cada año</p>
                </div>
              </div>
              <div className="col-6">
                <div className="card border-0 shadow-sm p-4 text-center h-100">
                  <div className="display-6">👩‍⚕️</div>
                  <p className="fw-bold mb-0 mt-2">Ariel &amp; Vinc</p>
                  <p className="text-secondary small mb-0">DSY1104 · 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
