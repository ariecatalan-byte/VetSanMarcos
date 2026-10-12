import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Alerta } from "../../components/comunes/Alerta";
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { FiltrosProductos } from "../../components/productos/FiltrosProductos";
import { ListaProductos } from "../../components/productos/ListaProductos";
import { useDatos } from "../../context/DatosContext";
import { precioFinal } from "../../utils/formato";
import { filtrarProductos, type FiltrosProductos as Filtros } from "../../utils/productos";

/** Vista "Categoría #1": productos de una categoría, con filtro por precio y nombre. */
export function CategoriaDetalle() {
  const { id = "" } = useParams<{ id: string }>();
  const { categorias, productos } = useDatos();
  const categoria = categorias.find((c) => c.id === id);
  const deLaCategoria = productos.filter((p) => p.categoriaId === id);
  const precioMaximo = Math.max(0, ...deLaCategoria.map(precioFinal));
  const [filtros, setFiltros] = useState<Filtros>({ categoriaId: id, precioMax: precioMaximo, texto: "" });

  if (categoria === undefined) {
    return (
      <div className="container py-5">
        <Alerta tipo="warning">La categoría solicitada no existe.</Alerta>
        <Link to="/categorias" className="btn btn-outline-secondary">&larr; Ver categorías</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <Link to="/categorias" className="btn btn-outline-secondary mb-4">&larr; Todas las categorías</Link>
      <EncabezadoPagina insignia="Categoría" titulo={categoria.nombre} descripcion={categoria.descripcion} />
      <FiltrosProductos filtros={filtros} onCambio={setFiltros} categorias={categorias} precioMaximoCatalogo={precioMaximo} mostrarCategoria={false} />
      <ListaProductos productos={filtrarProductos(deLaCategoria, filtros)} categorias={categorias} mensajeVacio="No hay productos que coincidan en esta categoría." />
    </div>
  );
}
