import { Link } from "react-router-dom";
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { useDatos } from "../../context/DatosContext";

/** Listado de categorías (las administra el rol administrador). Cada tarjeta lleva a su vista de productos. */
export function Categorias() {
  const { categorias, productos } = useDatos();
  return (
    <div className="container py-5">
      <EncabezadoPagina insignia="Categorías" titulo="Explora por categoría" descripcion="Elige una categoría para ver sus productos." />
      <div className="row g-4">
        {categorias.map((c) => {
          const cantidad = productos.filter((p) => p.categoriaId === c.id).length;
          return (
            <div key={c.id} className="col-12 col-sm-6 col-lg-4">
              <Link to={`/categorias/${c.id}`} className="text-decoration-none text-reset">
                <div className="card producto-card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h2 className="h5 fw-bold">{c.nombre}</h2>
                    <p className="text-secondary mb-2">{c.descripcion || "Sin descripción."}</p>
                    <span className="badge text-bg-primary">{cantidad} producto(s)</span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
