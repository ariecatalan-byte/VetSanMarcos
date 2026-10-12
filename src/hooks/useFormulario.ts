/**
 * hooks/useFormulario.ts
 * -----------------------------------------------------------------------
 * Hook reutilizable para formularios con INPUTS CONTROLADOS:
 *  - `valores`: estado (useState) con el valor de todos los campos.
 *  - `cambiar(campo, valor)`: actualiza un campo (evento onChange).
 *  - `errorDe(campo)`: mensaje de error del campo; solo se muestra si el
 *    usuario ya tocó el campo o intentó enviar (validación en tiempo real).
 *  - `intentarEnvio()`: marca el formulario como enviado y dice si es válido.
 * La función `validar` se pasa por parámetro: así el mismo hook sirve
 * para registro, perfil, productos, categorías, contacto y checkout.
 * -----------------------------------------------------------------------
 */
import { useState } from "react";
import type { Errores } from "../types";

export function useFormulario<T extends object>(inicial: T, validar: (valores: T) => Errores<T>) {
  const [valores, setValores] = useState<T>(inicial);
  const [tocados, setTocados] = useState<Array<keyof T>>([]);
  const [enviado, setEnviado] = useState(false);

  const errores = validar(valores);

  function cambiar<K extends keyof T>(campo: K, valor: T[K]) {
    setValores((anteriores) => ({ ...anteriores, [campo]: valor }));
    setTocados((anteriores) => (anteriores.includes(campo) ? anteriores : [...anteriores, campo]));
  }

  function errorDe(campo: keyof T): string | undefined {
    return enviado || tocados.includes(campo) ? errores[campo] : undefined;
  }

  function intentarEnvio(): boolean {
    setEnviado(true);
    return Object.keys(errores).length === 0;
  }

  function reiniciar(nuevos: T) {
    setValores(nuevos);
    setTocados([]);
    setEnviado(false);
  }

  return { valores, errores, cambiar, errorDe, intentarEnvio, reiniciar };
}
