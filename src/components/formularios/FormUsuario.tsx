/**
 * formularios/FormUsuario.tsx
 * -----------------------------------------------------------------------
 * UN solo formulario de usuario con 4 modos (prop `modo`):
 *   "registro"     → registro público (crea SIEMPRE un cliente, pide condiciones)
 *   "admin-crear"  → panel: crear usuario (elige rol según lo que permita el rol actual)
 *   "admin-editar" → panel: editar usuario (contraseña opcional)
 *   "perfil"       → editar el perfil propio (muestra el rol, no se puede cambiar)
 * Inputs controlados + validaciones en tiempo real (utils/validaciones.ts).
 * -----------------------------------------------------------------------
 */
import { useState } from "react";
import type { Resultado, Rol, Usuario } from "../../types";
import { ETIQUETA_ROL, GENEROS } from "../../data/constantes";
import { useFormulario } from "../../hooks/useFormulario";
import {
  calcularEdad, validarUsuario, type DatosFormUsuario, type ModoFormUsuario,
} from "../../utils/validaciones";
import { Alerta } from "../comunes/Alerta";
import { CampoCheck, CampoInput, CampoSelect } from "../comunes/Campos";
import { BadgeRol } from "../comunes/Insignias";
import { SelectRegionComuna } from "./SelectRegionComuna";

interface Props {
  modo: ModoFormUsuario;
  usuarioInicial?: Usuario;
  /** Roles que se pueden elegir en el select (vacío = no se muestra el select). */
  rolesDisponibles?: Rol[];
  /** Todos los usuarios, para detectar correos repetidos. */
  usuarios: Usuario[];
  textoBoton: string;
  onGuardar: (datos: DatosFormUsuario) => Resultado;
  /** Se ejecuta tras un guardado exitoso (ej: redirigir). */
  onExito?: () => void;
  /** Si es true, el rol del usuario editado no se puede cambiar (edición de uno mismo). */
  rolBloqueado?: boolean;
}

function valoresIniciales(usuario: Usuario | undefined, rolPorDefecto: Rol): DatosFormUsuario {
  return {
    nombre: usuario?.nombre ?? "",
    apellido: usuario?.apellido ?? "",
    fechaNacimiento: usuario?.fechaNacimiento ?? "",
    genero: usuario?.genero ?? "",
    correo: usuario?.correo ?? "",
    password: "",
    confirmarPassword: "",
    direccion: usuario?.direccion ?? "",
    region: usuario?.region ?? "",
    comuna: usuario?.comuna ?? "",
    rol: usuario?.rol ?? rolPorDefecto,
    aceptaCondiciones: false,
  };
}

export function FormUsuario({
  modo, usuarioInicial, rolesDisponibles = [], usuarios, textoBoton, onGuardar, onExito, rolBloqueado = false,
}: Props) {
  const rolPorDefecto: Rol = rolesDisponibles.includes("cliente") || rolesDisponibles.length === 0 ? "cliente" : rolesDisponibles[0];
  const correosEnUso = usuarios
    .filter((u) => u.id !== usuarioInicial?.id)
    .map((u) => u.correo.toLowerCase());

  const form = useFormulario<DatosFormUsuario>(
    valoresIniciales(usuarioInicial, rolPorDefecto),
    (v) => validarUsuario(v, { modo, correosEnUso }),
  );
  const { valores, cambiar, errorDe } = form;
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const pideContrasena = modo !== "perfil";
  const edad = calcularEdad(valores.fechaNacimiento);

  function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    setResultado(null);
    if (!form.intentarEnvio()) {
      setResultado({ ok: false, mensaje: "Revisa los campos marcados en rojo antes de continuar." });
      return;
    }
    const respuesta = onGuardar(valores);
    setResultado(respuesta);
    if (respuesta.ok) {
      // Al crear/registrar se limpia el formulario; al editar se conservan los valores.
      if (modo === "registro" || modo === "admin-crear") form.reiniciar(valoresIniciales(undefined, rolPorDefecto));
      onExito?.();
    }
  }

  return (
    <form onSubmit={alEnviar} noValidate>
      <div className="row g-3">
        <div className="col-md-6">
          <CampoInput id="nombre" etiqueta="Nombre" valor={valores.nombre} maxLength={50} error={errorDe("nombre")} onCambio={(v) => cambiar("nombre", v)} />
        </div>
        <div className="col-md-6">
          <CampoInput id="apellido" etiqueta="Apellido" valor={valores.apellido} maxLength={100} error={errorDe("apellido")} onCambio={(v) => cambiar("apellido", v)} />
        </div>

        <div className="col-md-4">
          <CampoInput id="fechaNacimiento" tipo="date" etiqueta="Fecha de nacimiento" valor={valores.fechaNacimiento}
            error={errorDe("fechaNacimiento")} ayuda={edad !== null && edad >= 0 ? `Edad: ${edad} años` : "Edad mínima: 14 años."}
            onCambio={(v) => cambiar("fechaNacimiento", v)} />
        </div>
        <div className="col-md-4">
          <CampoSelect id="genero" etiqueta="Género" placeholder="-- Seleccione --" valor={valores.genero} error={errorDe("genero")}
            opciones={GENEROS.map((g) => ({ valor: g, etiqueta: g }))}
            onCambio={(v) => cambiar("genero", v as DatosFormUsuario["genero"])} />
        </div>
        <div className="col-md-4">
          {modo === "registro" ? (
            <>
              <span className="form-label d-block">Rol</span>
              <BadgeRol rol="cliente" />
              <div className="form-text">El registro público crea cuentas de cliente.</div>
            </>
          ) : modo === "perfil" || rolesDisponibles.length === 0 ? (
            <>
              <span className="form-label d-block">Rol</span>
              <BadgeRol rol={valores.rol} />
              <div className="form-text">Tu rol no se puede modificar.</div>
            </>
          ) : (
            <CampoSelect id="rol" etiqueta="Rol" placeholder="-- Seleccione --" valor={valores.rol} disabled={rolBloqueado || rolesDisponibles.length === 1}
              opciones={rolesDisponibles.map((r) => ({ valor: r, etiqueta: ETIQUETA_ROL[r] }))}
              ayuda={rolBloqueado ? "No puedes cambiar tu propio rol." : rolesDisponibles.length === 1 ? "Solo puedes crear clientes." : undefined}
              onCambio={(v) => cambiar("rol", v as Rol)} />
          )}
        </div>

        <div className="col-12">
          <CampoInput id="correo" tipo="email" etiqueta="Correo electrónico institucional" placeholder="nombre@duoc.cl" valor={valores.correo}
            maxLength={100} error={errorDe("correo")} onCambio={(v) => cambiar("correo", v)} />
        </div>

        {pideContrasena && (
          <>
            <div className="col-md-6">
              <CampoInput id="password" tipo="password" etiqueta={modo === "admin-editar" ? "Nueva contraseña (opcional)" : "Contraseña"}
                valor={valores.password} error={errorDe("password")}
                ayuda={modo === "admin-editar" ? "Déjala vacía para conservar la actual." : "Mínimo 8 caracteres, con al menos 1 letra y 1 número."}
                onCambio={(v) => cambiar("password", v)} />
            </div>
            <div className="col-md-6">
              <CampoInput id="confirmarPassword" tipo="password" etiqueta="Confirmar contraseña" valor={valores.confirmarPassword}
                error={errorDe("confirmarPassword")} onCambio={(v) => cambiar("confirmarPassword", v)} />
            </div>
          </>
        )}

        <div className="col-12">
          <CampoInput id="direccion" etiqueta="Dirección" valor={valores.direccion} maxLength={300} error={errorDe("direccion")}
            onCambio={(v) => cambiar("direccion", v)} />
        </div>

        <SelectRegionComuna prefijoId="usuario" region={valores.region} comuna={valores.comuna} errorRegion={errorDe("region")}
          errorComuna={errorDe("comuna")} onRegion={(v) => cambiar("region", v)} onComuna={(v) => cambiar("comuna", v)} />

        {modo === "registro" && (
          <div className="col-12">
            <CampoCheck id="aceptaCondiciones" etiqueta="Acepto las condiciones de registro y el tratamiento de mis datos."
              marcado={valores.aceptaCondiciones} error={errorDe("aceptaCondiciones")} onCambio={(v) => cambiar("aceptaCondiciones", v)} />
          </div>
        )}

        <div className="col-12 d-grid mt-2">
          <button type="submit" className="btn btn-primary btn-lg">{textoBoton}</button>
        </div>
      </div>

      {resultado && <Alerta tipo={resultado.ok ? "success" : "danger"} className="mt-4 mb-0">{resultado.mensaje}</Alerta>}
    </form>
  );
}
