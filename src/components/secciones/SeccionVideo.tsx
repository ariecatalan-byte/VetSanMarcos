/** Video de tips de cuidado de mascotas (sección del Home). */
export function SeccionVideo() {
  return (
    <section className="container pb-5 text-center">
      <span className="badge text-bg-secondary mb-3">Video</span>
      <h2 className="h4 fw-bold mb-3">Tips de cuidado para tu mascota</h2>
      <div className="ratio ratio-16x9 mx-auto" style={{ maxWidth: 720 }}>
        <iframe src="https://www.youtube.com/embed/lanjx1y_ejg" title="Consejos para el cuidado de tu mascota" allowFullScreen loading="lazy" />
      </div>
    </section>
  );
}
