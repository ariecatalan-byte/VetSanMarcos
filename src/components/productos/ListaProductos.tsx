import type { Categoria, Producto } from "../../types";
import { Alerta } from "../comunes/Alerta";
import { ProductoCard } from "./ProductoCard";

interface Props {
  productos: Producto[];
  categorias: Categoria[];
  mensajeVacio?: string;
}

/** Grilla responsiva de tarjetas (renderizado dinámico con map + key). Muestra un aviso si no hay resultados. */
export function ListaProductos({ productos, categorias, mensajeVacio = "No se encontraron productos." }: Props) {
  if (productos.length === 0) return <Alerta tipo="warning">{mensajeVacio}</Alerta>;
  return (
    <div className="row g-4">
      {productos.map((p) => (
        <div key={p.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
          <ProductoCard producto={p} nombreCategoria={categorias.find((c) => c.id === p.categoriaId)?.nombre ?? "Sin categoría"} />
        </div>
      ))}
    </div>
  );
}
