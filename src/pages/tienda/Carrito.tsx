import { Link, useNavigate } from "react-router-dom";
import { Alerta } from "../../components/comunes/Alerta";
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { LineaCarritoFila } from "../../components/carrito/LineaCarritoFila";
import { useCarrito } from "../../context/CarritoContext";
import { formatearCLP } from "../../utils/formato";

/** Carrito de compras: lista dinámica de líneas + resumen. "Finalizar compra" lleva al checkout. */
export function Carrito() {
  const { lineas, totalItems, total, hayProblemasDeStock, vaciar } = useCarrito();
  const navegar = useNavigate();
  const vacio = lineas.length === 0;

  function alVaciar() {
    if (window.confirm("¿Vaciar todo el carrito de compras?")) vaciar();
  }

  return (
    <div className="container py-5">
      <EncabezadoPagina titulo="Mi carrito de compras" />
      <div className="row g-4">
        <div className="col-lg-8">
          {vacio ? (
            <Alerta tipo="light" className="border text-center">
              Tu carrito está vacío. <Link to="/productos">Ver productos</Link>
            </Alerta>
          ) : (
            <div className="d-flex flex-column gap-3">
              {lineas.map((l) => <LineaCarritoFila key={l.producto.id} linea={l} />)}
            </div>
          )}
          <button type="button" className="btn btn-outline-danger mt-3" disabled={vacio} onClick={alVaciar}>Vaciar carrito</button>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="h5 fw-bold mb-3">Resumen</h2>
              <div className="d-flex justify-content-between mb-2"><span>Productos</span><span>{totalItems}</span></div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5 mb-3"><span>Total</span><span>{formatearCLP(total)}</span></div>
              {hayProblemasDeStock && <Alerta tipo="danger">Hay productos con cantidad mayor al stock disponible. Ajusta las cantidades.</Alerta>}
              <button type="button" className="btn btn-primary w-100 btn-lg" disabled={vacio || hayProblemasDeStock}
                onClick={() => navegar("/checkout")}>
                Finalizar compra
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
