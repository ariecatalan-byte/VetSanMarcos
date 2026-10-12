/** Pie de página común a la tienda y al panel (datos del equipo y asignatura). */
export function FooterTienda() {
  return (
    <footer className="py-4 border-top mt-auto no-imprimir">
      <div className="container text-center equipo-info">
        <p className="mb-1"><strong>Vet San Marcos</strong> · Proyecto académico</p>
        <p className="mb-1">Integrantes: Ariel Catalán y Vinc González</p>
        <p className="mb-0">Asignatura: DSY1104 – Desarrollo FullStack II — Evaluación Parcial 2 — 2026</p>
      </div>
    </footer>
  );
}
