/**
 * pages/admin/ProductosAdmin.tsx
 * Listado de productos del panel. TODOS los roles del panel pueden consultar y
 * modificar el stock; los botones de crear / editar / eliminar solo aparecen si
 * el rol tiene el permiso (vendedor: no los ve).
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { StockEditor } from "../../components/admin/StockEditor";
import { Alerta } from "../../components/comunes/Alerta";
import { CampoInput, CampoSelect } from "../../components/comunes/Campos";
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { ImagenProducto } from "../../components/comunes/ImagenProducto";
import { useAuth } from "../../context/AuthContext";
import { useDatos } from "../../context/DatosContext";
import type { Resultado } from "../../types";
import { formatearCLP, precioFinal } from "../../utils/formato";
import { puede } from "../../utils/permisos";
import { esStockCritico } from "../../utils/productos";

export function ProductosAdmin() {
  const { usuario } = useAuth();
  const { productos, categorias, cambiarStock, eliminarProducto } = useDatos();
  const rol = usuario?.rol;
  const [texto, setTexto] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [aviso, setAviso] = useState<Resultado | null>(null);

  const filtrados = productos.filter(
    (p) => (categoriaId === "" || p.categoriaId === categoriaId) && p.nombre.toLowerCase().includes(texto.trim().toLowerCase()),
  );

  function eliminar(id: string, nombre: string) {
    if (window.confirm(`¿Eliminar el producto "${nombre}"? Esta acción no se puede deshacer.`)) setAviso(eliminarProducto(id));
  }

  return (
    <>
      <EncabezadoPagina titulo="Productos"
        descripcion={puede(rol, "productos:editar") ? "Administra el inventario: crea, edita, elimina y ajusta el stock." : "Consulta el inventario y modifica el stock de los productos."}
        acciones={
          <>
            <Link to="/admin/productos/criticos" className="btn btn-outline-danger">Productos críticos</Link>
            {puede(rol, "productos:crear") && <Link to="/admin/productos/nuevo" className="btn btn-primary">+ Nuevo producto</Link>}
          </>
        } />

      {aviso && <Alerta tipo={aviso.ok ? "success" : "danger"} onCerrar={() => setAviso(null)}>{aviso.mensaje}</Alerta>}

      <div className="row g-3 mb-3">
        <div className="col-md-6"><CampoInput id="buscarProducto" etiqueta="Buscar por nombre" valor={texto} onCambio={setTexto} /></div>
        <div className="col-md-4">
          <CampoSelect id="filtroCat" etiqueta="Categoría" placeholder="Todas" valor={categoriaId} opciones={categorias.map((c) => ({ valor: c.id, etiqueta: c.nombre }))} onCambio={setCategoriaId} />
        </div>
        <div className="col-md-2 d-flex align-items-end"><button type="button" className="btn btn-outline-secondary w-100" onClick={() => { setTexto(""); setCategoriaId(""); }}>Limpiar</button></div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle bg-white">
          <thead><tr><th>Imagen</th><th>Producto</th><th>Categoría</th><th className="text-end">Precio</th><th>Stock</th><th /></tr></thead>
          <tbody>
            {filtrados.map((p) => (
              <tr key={p.id} className={esStockCritico(p) ? "table-danger" : ""}>
                <td><ImagenProducto src={p.imagen} alt={p.nombre} className="carrito-item-img" /></td>
                <td>
                  <div className="fw-semibold">{p.nombre}</div>
                  <div className="small text-secondary">{p.id} · crítico ≤ {p.stockCritico}</div>
                </td>
                <td>{categorias.find((c) => c.id === p.categoriaId)?.nombre ?? "—"}</td>
                <td className="text-end">
                  {formatearCLP(precioFinal(p))}
                  {p.descuento > 0 && <div className="small text-danger">-{p.descuento}%</div>}
                </td>
                <td><StockEditor key={p.id} producto={p} onGuardar={cambiarStock} /></td>
                <td className="text-end text-nowrap">
                  {puede(rol, "productos:editar") && <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-outline-primary me-1">Editar</Link>}
                  {puede(rol, "productos:eliminar") && <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => eliminar(p.id, p.nombre)}>Eliminar</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtrados.length === 0 && <Alerta tipo="warning">No hay productos que coincidan.</Alerta>}
    </>
  );
}
