import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { ListaProductos } from "../../components/productos/ListaProductos";
import { useDatos } from "../../context/DatosContext";

/** Ofertas: todos los productos con descuento mayor a 0 (el descuento lo define el administrador). */
export function Ofertas() {
  const { productos, categorias } = useDatos();
  const enOferta = productos.filter((p) => p.descuento > 0).sort((a, b) => b.descuento - a.descuento);
  return (
    <div className="container py-5">
      <EncabezadoPagina insignia="Ofertas" titulo="Productos en oferta" descripcion="Aprovecha los descuentos vigentes." />
      <ListaProductos productos={enOferta} categorias={categorias} mensajeVacio="Por ahora no hay productos en oferta." />
    </div>
  );
}
