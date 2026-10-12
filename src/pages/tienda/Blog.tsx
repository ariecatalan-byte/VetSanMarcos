import { Link } from "react-router-dom";
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { ENTRADAS_BLOG } from "../../data/blog";

export function Blog() {
  return (
    <div className="container py-5">
      <EncabezadoPagina insignia="Blog" titulo="Consejos para tu mascota" descripcion="Artículos de cuidado y salud." />
      <div className="row g-4">
        {ENTRADAS_BLOG.map((e) => (
          <div key={e.slug} className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <p className="text-secondary small mb-1">{e.fecha}</p>
                <h2 className="h5 fw-bold">{e.titulo}</h2>
                <p>{e.resumen}</p>
                <Link to={`/blog/${e.slug}`} className="btn btn-outline-primary btn-sm">Leer artículo</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
