/**
 * Cliente HTTP único de la aplicación. Centraliza las solicitudes Axios, el JWT,
 * la renovación de sesión y la conversión de errores de la API.
 *
 * Ambos tokens se conservan solo en memoria: cerrar o recargar la página termina
 * la sesión y exige volver a iniciar sesión.
 */
import axios, { type AxiosRequestConfig } from "axios";
import { API_URL } from "../config";
import type { Resultado } from "../types";

const cliente = axios.create({
  baseURL: API_URL,
  headers: { Accept: "application/json" },
});

export class ApiError extends Error {
  constructor(
    public status: number,
    mensaje: string,
    public errores: Record<string, string> = {},
  ) {
    super(mensaje);
    this.name = "ApiError";
  }
}

/** Respuesta de login / registro / refresh. */
export interface SesionApi {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  usuario: import("../types").Usuario;
}

interface CuerpoError {
  mensaje?: string;
  errores?: Record<string, string>;
}

let accessToken: string | null = null;
let refreshToken: string | null = null;
let alExpirarSesion: (() => void) | null = null;
let renovacionEnCurso: Promise<boolean> | null = null;

export const tokensSesion = {
  obtenerRefresh: () => refreshToken,
  guardar(sesion: Pick<SesionApi, "accessToken" | "refreshToken">) {
    accessToken = sesion.accessToken;
    refreshToken = sesion.refreshToken;
  },
  limpiar() {
    accessToken = null;
    refreshToken = null;
  },
};

/** El AuthContext registra aquí qué hacer cuando la sesión ya no se puede renovar. */
export function registrarAlExpirarSesion(fn: (() => void) | null) {
  alExpirarSesion = fn;
}

function convertirError(error: unknown): ApiError {
  if (!axios.isAxiosError<CuerpoError>(error)) {
    return new ApiError(0, "Ocurrió un error inesperado. Inténtalo nuevamente.");
  }

  const status = error.response?.status ?? 0;
  const cuerpo = error.response?.data;
  const mensaje = cuerpo?.mensaje
    ?? (status === 0
      ? "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución e inténtalo nuevamente."
      : `Error ${status} del servidor.`);
  return new ApiError(status, mensaje, cuerpo?.errores ?? {});
}

interface Opciones {
  metodo?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  cuerpo?: unknown;
  /** false = endpoint público (no manda token ni intenta renovar). */
  auth?: boolean;
}

async function ejecutar<T>(ruta: string, { metodo = "GET", cuerpo, auth = true }: Opciones): Promise<T> {
  const headers: AxiosRequestConfig["headers"] = {};
  if (auth && accessToken !== null) headers.Authorization = `Bearer ${accessToken}`;
  try {
    const respuesta = await cliente.request<T>({
      url: ruta,
      method: metodo,
      data: cuerpo,
      headers,
    });
    return respuesta.status === 204 ? undefined as T : respuesta.data;
  } catch (error) {
    throw convertirError(error);
  }
}

/** Renueva el par de tokens una sola vez, compartiendo solicitudes simultáneas. */
export function renovarSesion(): Promise<boolean> {
  if (renovacionEnCurso) return renovacionEnCurso;
  const token = tokensSesion.obtenerRefresh();
  if (token === null) return Promise.resolve(false);

  renovacionEnCurso = (async () => {
    try {
      const { data } = await cliente.post<SesionApi>("/auth/refresh", { refreshToken: token });
      tokensSesion.guardar(data);
      return true;
    } catch (error) {
      const apiError = convertirError(error);
      if (apiError.status === 401) tokensSesion.limpiar();
      return false;
    } finally {
      renovacionEnCurso = null;
    }
  })();
  return renovacionEnCurso;
}

export async function solicitar<T>(ruta: string, opciones: Opciones = {}): Promise<T> {
  try {
    return await ejecutar<T>(ruta, opciones);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401 || opciones.auth === false || tokensSesion.obtenerRefresh() === null) {
      throw error;
    }

    if (!(await renovarSesion())) {
      alExpirarSesion?.();
      throw error;
    }

    try {
      return await ejecutar<T>(ruta, opciones);
    } catch (reintento) {
      if (reintento instanceof ApiError && reintento.status === 401) alExpirarSesion?.();
      throw reintento;
    }
  }
}

export const http = {
  get: <T>(ruta: string, auth = true) => solicitar<T>(ruta, { auth }),
  post: <T>(ruta: string, cuerpo?: unknown, auth = true) => solicitar<T>(ruta, { metodo: "POST", cuerpo, auth }),
  put: <T>(ruta: string, cuerpo: unknown) => solicitar<T>(ruta, { metodo: "PUT", cuerpo }),
  patch: <T>(ruta: string, cuerpo?: unknown) => solicitar<T>(ruta, { metodo: "PATCH", cuerpo }),
  delete: (ruta: string) => solicitar<void>(ruta, { metodo: "DELETE" }),
};

/** Ejecuta una operación de la API y convierte el resultado en un mensaje para la interfaz. */
export async function comoResultado(operacion: () => Promise<unknown>, mensajeExito: string): Promise<Resultado> {
  try {
    await operacion();
    return { ok: true, mensaje: mensajeExito };
  } catch (error) {
    return { ok: false, mensaje: mensajeDeError(error) };
  }
}

export function mensajeDeError(error: unknown): string {
  return error instanceof ApiError ? error.message : "Ocurrió un error inesperado. Inténtalo nuevamente.";
}
