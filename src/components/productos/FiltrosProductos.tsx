import type { Categoria } from "../../types";
import type { FiltrosProductos as Filtros } from "../../utils/productos";
import { formatearCLP } from "../../utils/formato";
import { CampoInput, CampoSelect } from "../comunes/Campos";

interface Props {
  filtros: Filtros;
  onCambio: (filtros: Filtros) => void;
  categorias: Categoria[];
  precioMaximoCatalogo: number;
  mostrarCategoria?: boolean;
}

/**
 * Filtros combinables del catálogo: categoría + precio máximo + búsqueda por nombre.
 * Es un componente "controlado": no guarda estado propio, lo recibe y lo devuelve por props.
 */
export function FiltrosProductos({ filtros, onCambio, categorias, precioMaximoCatalogo, mostrarCategoria = true }: Props) {
  return (
    <section className="card border-0 shadow-sm mb-4">
      <div className="card-body p-4">
        <div className="row g-3 align-items-end">
          {mostrarCategoria && (
            <div className="col-12 col-md-4">
              <CampoSelect id="filtroCategoria" etiqueta="Categoría" placeholder="Todas" valor={filtros.categoriaId === "todas" ? "" : filtros.categoriaId}
                opciones={categorias.map((c) => ({ valor: c.id, etiqueta: c.nombre }))}
                onCambio={(v) => onCambio({ ...filtros, categoriaId: v })} />
            </div>
          )}
          <div className="col-12 col-md-4">
            <CampoInput id="filtroPrecioMax" tipo="range" etiqueta={`Precio máximo: ${formatearCLP(filtros.precioMax)}`} min={0} max={precioMaximoCatalogo}
              step={500} valor={String(filtros.precioMax)} onCambio={(v) => onCambio({ ...filtros, precioMax: Number(v) })} />
          </div>
          <div className={mostrarCategoria ? "col-8 col-md-3" : "col-8 col-md-6"}>
            <CampoInput id="buscador" etiqueta="Buscar por nombre" placeholder="Ej: Bravecto" valor={filtros.texto}
              onCambio={(v) => onCambio({ ...filtros, texto: v })} />
          </div>
          <div className="col-4 col-md-1 d-grid">
            <button type="button" className="btn btn-outline-secondary"
              onClick={() => onCambio({ categoriaId: "todas", precioMax: precioMaximoCatalogo, texto: "" })}>
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
