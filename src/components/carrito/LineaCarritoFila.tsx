/**
 * carrito/LineaCarritoFila.tsx
 * Una fila del carrito: imagen, nombre, precio unitario, cantidad editable
 * (input controlado), subtotal y botón eliminar. Avisa si la cantidad
 * supera el stock disponible.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import type { LineaCarrito } from "../../types";
import { useCarrito } from "../../context/CarritoContext";
import { formatearCLP } from "../../utils/formato";
import { ImagenProducto } from "../comunes/ImagenProducto";

export function LineaCarritoFila({ linea }: { linea: LineaCarrito }) {
  const { cambiarCantidad, quitar } = useCarrito();
  const [aviso, setAviso] = useState("");
  const { producto } = linea;

  function alCambiar(texto: string) {
    const resultado = cambiarCantidad(producto.id, parseInt(texto, 10));
    setAviso(resultado.mensaje);
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body d-flex flex-wrap align-items-center gap-3">
        <ImagenProducto src={producto.imagen} alt={producto.nombre} className="carrito-item-img" />
        <div className="flex-grow-1" style={{ minWidth: 160 }}>
          <h3 className="h6 fw-bold mb-1"><Link className="text-decoration-none text-reset" to={`/productos/${producto.id}`}>{producto.nombre}</Link></h3>
          <p className="text-secondary mb-0 small">{formatearCLP(linea.precioUnitario)} c/u</p>
          {linea.cantidad > producto.stock && (
            <p className="stock-bajo small mb-0">Stock disponible: {producto.stock}. Ajusta la cantidad.</p>
          )}
          {aviso && <p className="text-warning-emphasis small mb-0">{aviso}</p>}
        </div>
        <div style={{ width: 90 }}>
          <label className="visually-hidden" htmlFor={`cant-${producto.id}`}>Cantidad de {producto.nombre}</label>
          <input id={`cant-${producto.id}`} type="number" min={1} max={producto.stock} value={linea.cantidad}
            className="form-control form-control-sm" onChange={(e) => alCambiar(e.target.value)} />
        </div>
        <div className="fw-bold text-end" style={{ minWidth: 100 }}>{formatearCLP(linea.subtotal)}</div>
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => quitar(producto.id)}>Eliminar</button>
      </div>
    </div>
  );
}
