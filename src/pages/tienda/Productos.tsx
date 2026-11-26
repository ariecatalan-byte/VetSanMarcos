/**
 * pages/tienda/Productos.tsx — Catálogo con filtros combinables.
 * El estado `filtros` (useState) controla qué productos se muestran: cada
 * cambio en un filtro actualiza el estado y la lista se recalcula con
 * filter() sin recargar la página.
 */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { FiltrosProductos } from "../../components/productos/FiltrosProductos";
import { ListaProductos } from "../../components/productos/ListaProductos";
import { useDatos } from "../../context/DatosContext";
import { precioFinal } from "../../utils/formato";
import { filtrarProductos, type FiltrosProductos as Filtros } from "../../utils/productos";

export function Productos() {
  const { productos, categorias } = useDatos();
  const [parametros] = useSearchParams();
  const precioMaximoCatalogo = Math.max(0, ...productos.map(precioFinal));
  const enOferta = productos.filter((p) => p.descuento > 0).sort((a, b) => b.descuento - a.descuento);

  useEffect(() => {
    if (parametros.get("seccion") === "ofertas") {
      document.getElementById("ofertas")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [parametros]);

  // La categoría puede venir en la URL (/productos?categoria=Alimento)
  const [filtros, setFiltros] = useState<Filtros>({
    categoriaId: parametros.get("categoria") ?? "todas",
    precioMax: null,
    texto: "",
  });

  const filtrados = filtrarProductos(productos, filtros);

  return (
    <div className="container py-5">
      <EncabezadoPagina insignia="Catálogo" titulo="Nuestros productos"
        descripcion="Filtra por categoría, precio y nombre. Los filtros se combinan y actualizan la lista al instante." />
      <section id="ofertas" className="rounded-4 bg-primary-subtle p-4 p-md-5 mb-5" style={{ scrollMarginTop: "5rem" }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <span className="badge text-bg-danger mb-2">Ofertas destacadas</span>
            <h2 className="h3 fw-bold mb-1">Aprovecha los descuentos</h2>
            <p className="text-secondary mb-0">Encuentra algo especial para tu mascota antes de que termine la oferta.</p>
          </div>
          <button type="button" className="btn btn-outline-primary"
            onClick={() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })}>
            Ver todo el catálogo
          </button>
        </div>
        <ListaProductos productos={enOferta} categorias={categorias} mensajeVacio="Por ahora no hay productos en oferta." />
      </section>
      <div id="catalogo">
        <FiltrosProductos filtros={filtros} onCambio={setFiltros} categorias={categorias} precioMaximoCatalogo={precioMaximoCatalogo} />
        <p className="text-secondary" aria-live="polite">{filtrados.length} producto(s) encontrado(s).</p>
        <ListaProductos productos={filtrados} categorias={categorias} mensajeVacio="No se encontraron productos con esos filtros." />
      </div>
    </div>
  );
}
