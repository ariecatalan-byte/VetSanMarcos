import { Link } from "react-router-dom";
import { StockEditor } from "../../components/admin/StockEditor";
import { Alerta } from "../../components/comunes/Alerta";
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { useDatos } from "../../context/DatosContext";
import { esStockCritico } from "../../utils/productos";

/** Listado de productos críticos: stock menor o igual a su "stock crítico". Permite reponer stock directamente. */
export function ProductosCriticos() {
  const { productos, categorias, cambiarStock } = useDatos();
  const criticos = productos.filter(esStockCritico).sort((a, b) => a.stock - b.stock);
  return (
    <>
      <EncabezadoPagina titulo="Productos críticos" descripcion="Productos con stock igual o inferior al nivel crítico."
        acciones={<Link to="/admin/productos" className="btn btn-outline-secondary">&larr; Volver a productos</Link>} />
      {criticos.length === 0 ? (
        <Alerta tipo="success">No hay productos con stock crítico. 🎉</Alerta>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle bg-white">
            <thead><tr><th>Producto</th><th>Categoría</th><th className="text-end">Stock crítico</th><th>Reponer stock</th></tr></thead>
            <tbody>
              {criticos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{categorias.find((c) => c.id === p.categoriaId)?.nombre ?? "—"}</td>
                  <td className="text-end">{p.stockCritico}</td>
                  <td><StockEditor key={p.id} producto={p} onGuardar={cambiarStock} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
