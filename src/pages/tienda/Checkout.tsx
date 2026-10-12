/**
 * pages/tienda/Checkout.tsx — Paso de pago.
 * El cliente indica sus datos y dirección de entrega (si inició sesión, se
 * rellenan automáticamente desde su perfil). El pago es una SIMULACIÓN:
 * un select permite elegir si el pago resulta aprobado o rechazado, para
 * poder demostrar las dos vistas del flujo (compra exitosa / pago con error).
 */
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Alerta } from "../../components/comunes/Alerta";
import { CampoInput, CampoSelect } from "../../components/comunes/Campos";
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { SelectRegionComuna } from "../../components/formularios/SelectRegionComuna";
import { useAuth } from "../../context/AuthContext";
import { useCarrito } from "../../context/CarritoContext";
import { useDatos } from "../../context/DatosContext";
import { useFormulario } from "../../hooks/useFormulario";
import { formatearCLP } from "../../utils/formato";
import { validarCheckout, type DatosFormCheckout } from "../../utils/validaciones";

export function Checkout() {
  const { usuario } = useAuth();
  const { lineas, total, vaciar } = useCarrito();
  const { procesarCompra } = useDatos();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const [error, setError] = useState("");

  // Si venimos de "Volver a realizar el pago" se reutilizan los datos ingresados antes.
  const previos = (ubicacion.state as { datos?: DatosFormCheckout } | null)?.datos;
  const inicial: DatosFormCheckout = previos ?? {
    nombre: usuario?.nombre ?? "",
    apellidos: usuario?.apellido ?? "",
    correo: usuario?.correo ?? "",
    calle: usuario?.direccion ?? "",
    departamento: "",
    region: usuario?.region ?? "",
    comuna: usuario?.comuna ?? "",
    indicaciones: "",
    resultadoPago: "aprobado",
  };
  const form = useFormulario<DatosFormCheckout>(inicial, validarCheckout);
  const { valores, cambiar, errorDe } = form;

  if (lineas.length === 0) return <Navigate to="/carrito" replace />;

  function alPagar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.intentarEnvio()) return;

    const respuesta = procesarCompra({
      lineas,
      cliente: { nombre: valores.nombre.trim(), apellidos: valores.apellidos.trim(), correo: valores.correo.trim() },
      entrega: {
        calle: valores.calle.trim(), departamento: valores.departamento.trim(), region: valores.region,
        comuna: valores.comuna, indicaciones: valores.indicaciones.trim(),
      },
      pagoAprobado: valores.resultadoPago === "aprobado",
    });

    if (!respuesta.ok || respuesta.orden === undefined) {
      setError(respuesta.mensaje); // p. ej. no hay stock suficiente
      return;
    }
    if (respuesta.orden.estado === "pagada") {
      vaciar();
      navegar(`/compra/exitosa/${respuesta.orden.id}`);
    } else {
      navegar(`/compra/error/${respuesta.orden.id}`);
    }
  }

  return (
    <div className="container py-5">
      <EncabezadoPagina insignia="Checkout" titulo="Datos de compra y entrega"
        descripcion={usuario ? "Rellenamos tus datos con la información de tu perfil." : "Completa la siguiente información."} />
      <form onSubmit={alPagar} noValidate>
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h2 className="h5 fw-bold">Información del cliente</h2>
                <div className="row g-3 mt-1">
                  <div className="col-md-6"><CampoInput id="ch-nombre" etiqueta="Nombre" valor={valores.nombre} error={errorDe("nombre")} onCambio={(v) => cambiar("nombre", v)} /></div>
                  <div className="col-md-6"><CampoInput id="ch-apellidos" etiqueta="Apellidos" valor={valores.apellidos} error={errorDe("apellidos")} onCambio={(v) => cambiar("apellidos", v)} /></div>
                  <div className="col-12"><CampoInput id="ch-correo" tipo="email" etiqueta="Correo" valor={valores.correo} error={errorDe("correo")} onCambio={(v) => cambiar("correo", v)} /></div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="h5 fw-bold">Dirección de entrega de los productos</h2>
                <div className="row g-3 mt-1">
                  <div className="col-md-8"><CampoInput id="ch-calle" etiqueta="Calle" valor={valores.calle} error={errorDe("calle")} onCambio={(v) => cambiar("calle", v)} /></div>
                  <div className="col-md-4"><CampoInput id="ch-depto" etiqueta="Departamento (opcional)" placeholder="Ej: 603" valor={valores.departamento} onCambio={(v) => cambiar("departamento", v)} /></div>
                  <SelectRegionComuna prefijoId="ch" region={valores.region} comuna={valores.comuna} errorRegion={errorDe("region")} errorComuna={errorDe("comuna")}
                    onRegion={(v) => cambiar("region", v)} onComuna={(v) => cambiar("comuna", v)} />
                  <div className="col-12">
                    <CampoInput id="ch-indicaciones" multilinea filas={3} etiqueta="Indicaciones para la entrega (opcional)" maxLength={300}
                      placeholder="Ej: Entre calles, color del edificio, no tiene timbre." valor={valores.indicaciones} error={errorDe("indicaciones")}
                      onCambio={(v) => cambiar("indicaciones", v)} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="h5 fw-bold mb-3">Resumen del carrito</h2>
                <ul className="list-unstyled mb-3">
                  {lineas.map((l) => (
                    <li key={l.producto.id} className="d-flex justify-content-between small mb-1">
                      <span>{l.cantidad} × {l.producto.nombre}</span>
                      <span className="ms-2 text-nowrap">{formatearCLP(l.subtotal)}</span>
                    </li>
                  ))}
                </ul>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5 mb-3"><span>Total a pagar</span><span>{formatearCLP(total)}</span></div>

                <CampoSelect id="ch-pago" etiqueta="Resultado del pago (simulación)" placeholder="" valor={valores.resultadoPago}
                  opciones={[{ valor: "aprobado", etiqueta: "Pago aprobado" }, { valor: "rechazado", etiqueta: "Pago rechazado" }]}
                  ayuda="Proyecto académico: no hay pasarela real. Elige el resultado para demostrar ambos flujos."
                  onCambio={(v) => cambiar("resultadoPago", v === "rechazado" ? "rechazado" : "aprobado")} />

                {error && <Alerta tipo="danger" className="mt-3">{error}</Alerta>}
                <button type="submit" className="btn btn-success btn-lg w-100 mt-3">Pagar ahora {formatearCLP(total)}</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
