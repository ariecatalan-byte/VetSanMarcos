/**
 * productos/ProductoCard.tsx
 * Tarjeta de producto reutilizada en Home (destacados), Catálogo, Categorías
 * y Ofertas. Recibe el producto por props y notifica el resultado de
 * "Añadir al carrito" con un pequeño estado local (`mensaje`).
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Producto } from "../../types";
import { useCarrito } from "../../context/CarritoContext";
import { ImagenProducto } from "../comunes/ImagenProducto";
import { EstadoStock } from "../comunes/Insignias";
import { PrecioProducto } from "./PrecioProducto";

interface Props {
  producto: Producto;
  nombreCategoria: string;
}

export function ProductoCard({ producto, nombreCategoria }: Props) {
  const { agregar } = useCarrito();
  const [mensaje, setMensaje] = useState<string | null>(null);
  const sinStock = producto.stock === 0;

  function alAgregar() {
    const resultado = agregar(producto.id, 1);
    setMensaje(resultado.ok ? "¡Añadido!" : "Sin stock suficiente");
    setTimeout(() => setMensaje(null), 1400);
  }

  return (
    <div className="card producto-card border-0 shadow-sm h-100">
      <Link to={`/productos/${producto.id}`} className="text-decoration-none text-reset">
        <ImagenProducto src={producto.imagen} alt={producto.nombre} className="producto-img" />
      </Link>
      <div className="card-body d-flex flex-column">
        <span className="badge text-bg-light text-dark mb-2 align-self-start">{nombreCategoria}</span>
        <h3 className="h6 fw-bold">
          <Link to={`/productos/${producto.id}`} className="text-decoration-none text-reset">{producto.nombre}</Link>
        </h3>
        <PrecioProducto producto={producto} />
        <p className="mb-2 mt-1"><EstadoStock producto={producto} /></p>
        <button type="button" className="btn btn-primary btn-sm mt-auto" disabled={sinStock || mensaje !== null} onClick={alAgregar}>
          {sinStock ? "Sin stock" : (mensaje ?? "Añadir al carrito")}
        </button>
      </div>
    </div>
  );
}
