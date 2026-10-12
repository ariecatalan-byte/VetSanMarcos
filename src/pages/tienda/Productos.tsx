/**
 * pages/tienda/Productos.tsx — Catálogo con filtros combinables.
 * El estado `filtros` (useState) controla qué productos se muestran: cada
 * cambio en un filtro actualiza el estado y la lista se recalcula con
 * filter() sin recargar la página.
 */
import { useState } from "react";
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

  // La categoría puede venir en la URL (/productos?categoria=Alimento)
  const [filtros, setFiltros] = useState<Filtros>({
    categoriaId: parametros.get("categoria") ?? "todas",
    precioMax: precioMaximoCatalogo,
    texto: "",
  });

  const filtrados = filtrarProductos(productos, filtros);

  return (
    <div className="container py-5">
      <EncabezadoPagina insignia="Catálogo" titulo="Nuestros productos"
        descripcion="Filtra por categoría, precio y nombre. Los filtros se combinan y actualizan la lista al instante." />
      <FiltrosProductos filtros={filtros} onCambio={setFiltros} categorias={categorias} precioMaximoCatalogo={precioMaximoCatalogo} />
      <p className="text-secondary" aria-live="polite">{filtrados.length} producto(s) encontrado(s).</p>
      <ListaProductos productos={filtrados} categorias={categorias} mensajeVacio="No se encontraron productos con esos filtros." />
    </div>
  );
}
