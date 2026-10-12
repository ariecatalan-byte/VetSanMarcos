import { Link } from "react-router-dom";
import { ListaProductos } from "../../components/productos/ListaProductos";
import { SeccionContacto } from "../../components/secciones/SeccionContacto";
import { SeccionNosotros } from "../../components/secciones/SeccionNosotros";
import { SeccionVideo } from "../../components/secciones/SeccionVideo";
import { useDatos } from "../../context/DatosContext";

/** Página principal: hero, productos destacados (los 3 con más stock), video, quiénes somos y contacto. */
export function Home() {
  const { productos, categorias } = useDatos();
  const destacados = [...productos].sort((a, b) => b.stock - a.stock).slice(0, 3);

  return (
    <>
      <section className="container py-5">
        <div className="hero-section p-4 p-md-5 mb-5 text-center">
          <span className="badge text-bg-light text-dark mb-3">Tienda online veterinaria</span>
          <h1 className="display-5 fw-bold">Todo para el bienestar de tu mascota</h1>
          <p className="lead mb-0">Medicamentos, alimento y accesorios con despacho a todo Chile.</p>
          <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
            <Link to="/productos" className="btn btn-light btn-lg fw-bold">Ver catálogo completo</Link>
            <Link to="/ofertas" className="btn btn-outline-light btn-lg fw-bold">Ver ofertas</Link>
          </div>
        </div>
        <h2 className="h4 fw-bold mb-4">Productos destacados</h2>
        <ListaProductos productos={destacados} categorias={categorias} />
      </section>
      <SeccionVideo />
      <SeccionNosotros />
      <SeccionContacto />
    </>
  );
}
