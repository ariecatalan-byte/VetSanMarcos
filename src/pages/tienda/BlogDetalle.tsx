import { Link, useParams } from "react-router-dom";
import { Alerta } from "../../components/comunes/Alerta";
import { ENTRADAS_BLOG } from "../../data/blog";

export function BlogDetalle() {
  const { slug } = useParams<{ slug: string }>();
  const entrada = ENTRADAS_BLOG.find((e) => e.slug === slug);
  return (
    <div className="container py-5" style={{ maxWidth: 800 }}>
      <Link to="/blog" className="btn btn-outline-secondary mb-4">&larr; Volver al blog</Link>
      {entrada === undefined ? (
        <Alerta tipo="warning">No se encontró el artículo.</Alerta>
      ) : (
        <article>
          <p className="text-secondary small">{entrada.fecha}</p>
          <h1 className="fw-bold mb-4">{entrada.titulo}</h1>
          {entrada.contenido.map((parrafo, i) => (
            <p key={i}>{parrafo}</p>
          ))}
        </article>
      )}
    </div>
  );
}
