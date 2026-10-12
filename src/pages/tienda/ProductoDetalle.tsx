import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Alerta } from "../../components/comunes/Alerta";
import { ImagenProducto } from "../../components/comunes/ImagenProducto";
import { PrecioProducto } from "../../components/productos/PrecioProducto";
import { useCarrito } from "../../context/CarritoContext";
import { useDatos } from "../../context/DatosContext";
import type { Resultado } from "../../types";

/** Detalle de producto: ficha completa con control de stock y selector de cantidad. */
export function ProductoDetalle() {
  const { id } = useParams<{ id: string }>();
  const { productos, categorias } = useDatos();
  const { agregar } = useCarrito();
  const [cantidad, setCantidad] = useState("1");
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const producto = productos.find((p) => p.id === id);

  if (producto === undefined) {
    return (
      <div className="container py-5">
        <Alerta tipo="warning">No se encontró el producto solicitado.</Alerta>
        <Link to="/productos" className="btn btn-outline-secondary">&larr; Volver al catálogo</Link>
      </div>
    );
  }

  const categoria = categorias.find((c) => c.id === producto.categoriaId);
  const sinStock = producto.stock === 0;
  const critico = producto.stock <= producto.stockCritico;

  function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (producto === undefined) return;
    setResultado(agregar(producto.id, parseInt(cantidad, 10)));
  }

  return (
    <div className="container py-5">
      <Link to="/productos" className="btn btn-outline-secondary mb-4">&larr; Volver al catálogo</Link>
      <div className="row g-5">
        <div className="col-lg-5">
          <ImagenProducto src={producto.imagen} alt={producto.nombre} className="detalle-img" />
        </div>
        <div className="col-lg-7">
          <span className="badge text-bg-secondary mb-2">{categoria?.nombre ?? "Sin categoría"}</span>
          <h1 className="fw-bold mb-2">{producto.nombre}</h1>
          <p className="text-secondary">Especie: {producto.especie}</p>
          <div className="mb-3"><PrecioProducto producto={producto} grande /></div>
          <p className="mb-4">{producto.descripcion}</p>

          <p className="mb-3 fw-semibold">
            {sinStock ? <span className="stock-agotado">Sin stock disponible</span>
              : critico ? <span className="stock-bajo">Quedan solo {producto.stock} unidad(es)</span>
              : <span className="text-success">Stock disponible: {producto.stock} unidad(es)</span>}
          </p>

          <form onSubmit={alEnviar} className="row g-3 align-items-end">
            <div className="col-auto">
              <label htmlFor="cantidadProducto" className="form-label">Cantidad</label>
              <input id="cantidadProducto" type="number" className="form-control" min={1} max={producto.stock} value={cantidad}
                disabled={sinStock} onChange={(e) => setCantidad(e.target.value)} />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary btn-lg" disabled={sinStock}>Añadir al carrito</button>
            </div>
          </form>
          {resultado && <Alerta tipo={resultado.ok ? "success" : "danger"} className="mt-3">{resultado.mensaje}</Alerta>}
        </div>
      </div>
    </div>
  );
}
