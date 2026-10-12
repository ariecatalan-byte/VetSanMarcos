import { useState } from "react";
import { useFormulario } from "../../hooks/useFormulario";
import { validarContacto, type DatosFormContacto } from "../../utils/validaciones";
import { Alerta } from "../comunes/Alerta";
import { CampoInput } from "../comunes/Campos";

const VACIO: DatosFormContacto = { nombre: "", correo: "", mensaje: "" };

/** Formulario de contacto (sección Contacto del Home y página /contacto). Reglas heredadas de EP1. */
export function FormContacto() {
  const form = useFormulario<DatosFormContacto>(VACIO, validarContacto);
  const { valores, cambiar, errorDe } = form;
  const [enviado, setEnviado] = useState(false);

  function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviado(false);
    if (!form.intentarEnvio()) return;
    form.reiniciar(VACIO);
    setEnviado(true);
  }

  return (
    <form onSubmit={alEnviar} noValidate>
      <div className="mb-3">
        <CampoInput id="nombreContacto" etiqueta="Nombre completo" maxLength={100} valor={valores.nombre} error={errorDe("nombre")} onCambio={(v) => cambiar("nombre", v)} />
      </div>
      <div className="mb-3">
        <CampoInput id="correoContacto" tipo="email" etiqueta="Correo electrónico (opcional)" maxLength={100} valor={valores.correo} error={errorDe("correo")} onCambio={(v) => cambiar("correo", v)} />
      </div>
      <div className="mb-3">
        <CampoInput id="mensajeContacto" multilinea filas={4} etiqueta="Mensaje" maxLength={500} valor={valores.mensaje} error={errorDe("mensaje")} onCambio={(v) => cambiar("mensaje", v)} />
      </div>
      <button type="submit" className="btn btn-primary w-100">Enviar mensaje</button>
      {enviado && <Alerta tipo="success" className="mt-3 mb-0" onCerrar={() => setEnviado(false)}>¡Gracias! Tu mensaje fue registrado correctamente.</Alerta>}
    </form>
  );
}
