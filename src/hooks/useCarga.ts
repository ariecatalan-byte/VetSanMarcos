/**
 * hooks/useCarga.ts
 * Hook para pedir datos a la API y exponer { datos, cargando, error, recargar }.
 * Evita actualizar el estado si el componente ya se desmontó (o cambió el parámetro) antes de que llegue la respuesta.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { mensajeDeError } from "../api/cliente";

export function useCarga<T>(cargar: () => Promise<T>, dependencias: readonly unknown[] = []) {
  const [datos, setDatos] = useState<T | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  const cargarRef = useRef(cargar);
  cargarRef.current = cargar;

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    setError("");
    cargarRef
      .current()
      .then((resultado) => {
        if (vigente) setDatos(resultado);
      })
      .catch((e: unknown) => {
        if (vigente) setError(mensajeDeError(e));
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });
    return () => {
      vigente = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencias, version]);

  const recargar = useCallback(() => setVersion((v) => v + 1), []);
  return { datos, setDatos, cargando, error, recargar };
}
