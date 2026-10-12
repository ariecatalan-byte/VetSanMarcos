/** Reportes (solo administrador): indicadores calculados a partir de las órdenes pagadas. */
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { useDatos } from "../../context/DatosContext";
import { formatearCLP } from "../../utils/formato";
import { esStockCritico } from "../../utils/productos";

export function Reportes() {
  const { ordenes, productos, categorias } = useDatos();
  const pagadas = ordenes.filter((o) => o.estado === "pagada");
  const rechazadas = ordenes.length - pagadas.length;
  const ventas = pagadas.reduce((s, o) => s + o.total, 0);

  // Unidades e ingresos por producto y por categoría (usando solo órdenes pagadas)
  const porProducto = new Map<string, { nombre: string; unidades: number; ingresos: number }>();
  const porCategoria = new Map<string, number>();
  pagadas.forEach((o) =>
    o.lineas.forEach((l) => {
      const actual = porProducto.get(l.idProducto) ?? { nombre: l.nombre, unidades: 0, ingresos: 0 };
      porProducto.set(l.idProducto, { ...actual, unidades: actual.unidades + l.cantidad, ingresos: actual.ingresos + l.subtotal });
      const catId = productos.find((p) => p.id === l.idProducto)?.categoriaId;
      const catNombre = categorias.find((c) => c.id === catId)?.nombre ?? "Sin categoría";
      porCategoria.set(catNombre, (porCategoria.get(catNombre) ?? 0) + l.subtotal);
    }),
  );
  const top = [...porProducto.values()].sort((a, b) => b.unidades - a.unidades).slice(0, 5);
  const categoriasOrdenadas = [...porCategoria.entries()].sort((a, b) => b[1] - a[1]);
  const maxCategoria = Math.max(1, ...categoriasOrdenadas.map(([, v]) => v));

  return (
    <>
      <EncabezadoPagina titulo="Reportes" descripcion="Indicadores de ventas e inventario." />
      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3"><div className="card border-0 shadow-sm p-3"><div className="small text-secondary">Ventas totales</div><div className="fs-4 fw-bold">{formatearCLP(ventas)}</div></div></div>
        <div className="col-6 col-xl-3"><div className="card border-0 shadow-sm p-3"><div className="small text-secondary">Compras pagadas</div><div className="fs-4 fw-bold">{pagadas.length}</div></div></div>
        <div className="col-6 col-xl-3"><div className="card border-0 shadow-sm p-3"><div className="small text-secondary">Pagos rechazados</div><div className="fs-4 fw-bold">{rechazadas}</div></div></div>
        <div className="col-6 col-xl-3"><div className="card border-0 shadow-sm p-3"><div className="small text-secondary">Ticket promedio</div><div className="fs-4 fw-bold">{formatearCLP(pagadas.length ? Math.round(ventas / pagadas.length) : 0)}</div></div></div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm"><div className="card-body">
            <h2 className="h5 fw-bold mb-3">Ventas por categoría</h2>
            {categoriasOrdenadas.length === 0 ? <p className="text-secondary mb-0">Aún no hay ventas.</p> : categoriasOrdenadas.map(([nombre, valor]) => (
              <div key={nombre} className="mb-3">
                <div className="d-flex justify-content-between small"><span>{nombre}</span><span>{formatearCLP(valor)}</span></div>
                <div className="progress"><div className="progress-bar" style={{ width: `${(valor / maxCategoria) * 100}%` }} /></div>
              </div>
            ))}
          </div></div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm"><div className="card-body">
            <h2 className="h5 fw-bold mb-3">Productos más vendidos</h2>
            {top.length === 0 ? <p className="text-secondary mb-0">Aún no hay ventas.</p> : (
              <div className="table-responsive"><table className="table table-sm mb-0">
                <thead><tr><th>Producto</th><th className="text-end">Unidades</th><th className="text-end">Ingresos</th></tr></thead>
                <tbody>{top.map((t) => <tr key={t.nombre}><td>{t.nombre}</td><td className="text-end">{t.unidades}</td><td className="text-end">{formatearCLP(t.ingresos)}</td></tr>)}</tbody>
              </table></div>
            )}
          </div></div>
        </div>
        <div className="col-12">
          <div className="card border-0 shadow-sm"><div className="card-body">
            <h2 className="h5 fw-bold mb-2">Inventario</h2>
            <p className="mb-0">{productos.length} productos en catálogo · <strong className="text-danger">{productos.filter(esStockCritico).length}</strong> con stock crítico · {productos.filter((p) => p.descuento > 0).length} en oferta.</p>
          </div></div>
        </div>
      </div>
    </>
  );
}
