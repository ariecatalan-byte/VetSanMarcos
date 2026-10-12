import { Link, useParams } from "react-router-dom";
import { Alerta } from "../../components/comunes/Alerta";
import { ResumenOrden } from "../../components/ordenes/ResumenOrden";
import { useDatos } from "../../context/DatosContext";
import type { DatosFormCheckout } from "../../utils/validaciones";

/** Vista "Pago con error": el carrito y el stock NO se tocaron; se puede reintentar el pago. */
export function PagoError() {
  const { id } = useParams<{ id: string }>();
  const { ordenes } = useDatos();
  const orden = ordenes.find((o) => o.id === id && o.estado === "rechazada");

  if (orden === undefined) {
    return (
      <div className="container py-5">
        <Alerta tipo="warning">No se encontró el intento de pago solicitado.</Alerta>
        <Link to="/carrito" className="btn btn-primary">Volver al carrito</Link>
      </div>
    );
  }

  // Se reenvían los datos ingresados para no obligar al cliente a escribirlos otra vez.
  const datos: DatosFormCheckout = {
    nombre: orden.cliente.nombre, apellidos: orden.cliente.apellidos, correo: orden.cliente.correo,
    calle: orden.entrega.calle, departamento: orden.entrega.departamento, region: orden.entrega.region,
    comuna: orden.entrega.comuna, indicaciones: orden.entrega.indicaciones, resultadoPago: "aprobado",
  };

  return (
    <div className="container py-5" style={{ maxWidth: 900 }}>
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h1 className="h3 fw-bold text-danger mb-2">❌ No se pudo realizar el pago. N° #{orden.numero}</h1>
          <p className="text-secondary">Tu carrito sigue intacto y no se descontó stock. Puedes intentarlo nuevamente.</p>
          <div className="text-center mb-4">
            <Link to="/checkout" state={{ datos }} className="btn btn-success btn-lg">VOLVER A REALIZAR EL PAGO</Link>
          </div>
          <ResumenOrden orden={orden} />
        </div>
      </div>
    </div>
  );
}
