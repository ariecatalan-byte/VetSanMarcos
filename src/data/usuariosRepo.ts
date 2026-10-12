/**
 * data/usuariosRepo.ts — CRUD de usuarios, sesión y control de intentos de
 * login (regla heredada de EP1: bloqueo tras 3 intentos fallidos).
 */
import type { NuevoUsuario, Usuario } from "../types";
import { MAX_INTENTOS_FALLIDOS } from "./constantes";
import { borrar, CLAVES, guardar, leer, siguienteId } from "./storage";

export interface RegistroIntentos {
  fallidos: number;
  bloqueado: boolean;
}
export type MapaIntentos = Record<string, RegistroIntentos>;

export const usuariosRepo = {
  listar(): Usuario[] {
    return leer<Usuario[]>(CLAVES.usuarios, []);
  },

  obtenerPorId(id: string): Usuario | null {
    return this.listar().find((u) => u.id === id) ?? null;
  },

  obtenerPorCorreo(correo: string): Usuario | null {
    const buscado = correo.trim().toLowerCase();
    return this.listar().find((u) => u.correo.toLowerCase() === buscado) ?? null;
  },

  crear(datos: NuevoUsuario): Usuario {
    const usuarios = this.listar();
    const nuevo: Usuario = { ...datos, id: siguienteId("U", usuarios.map((u) => u.id)) };
    guardar(CLAVES.usuarios, [...usuarios, nuevo]);
    return nuevo;
  },

  actualizar(id: string, cambios: Partial<NuevoUsuario>): boolean {
    const usuarios = this.listar();
    if (!usuarios.some((u) => u.id === id)) return false;
    guardar(CLAVES.usuarios, usuarios.map((u) => (u.id === id ? { ...u, ...cambios } : u)));
    return true;
  },

  eliminar(id: string): boolean {
    const usuarios = this.listar();
    if (!usuarios.some((u) => u.id === id)) return false;
    guardar(CLAVES.usuarios, usuarios.filter((u) => u.id !== id));
    return true;
  },

  /* ----------------------------- sesión ----------------------------- */
  obtenerSesion(): string | null {
    return leer<string | null>(CLAVES.sesion, null);
  },
  iniciarSesion(idUsuario: string): void {
    guardar(CLAVES.sesion, idUsuario);
  },
  cerrarSesion(): void {
    borrar(CLAVES.sesion);
  },

  /* ------------------- intentos fallidos de login ------------------- */
  obtenerIntentos(): MapaIntentos {
    return leer<MapaIntentos>(CLAVES.intentos, {});
  },

  /** Suma un intento fallido; al llegar al máximo, bloquea la cuenta. */
  registrarIntentoFallido(correo: string): RegistroIntentos {
    const intentos = this.obtenerIntentos();
    const clave = correo.trim().toLowerCase();
    const actual = intentos[clave] ?? { fallidos: 0, bloqueado: false };
    const fallidos = actual.fallidos + 1;
    const nuevo: RegistroIntentos = { fallidos, bloqueado: fallidos >= MAX_INTENTOS_FALLIDOS };
    guardar(CLAVES.intentos, { ...intentos, [clave]: nuevo });
    return nuevo;
  },

  reiniciarIntentos(correo: string): void {
    const intentos = this.obtenerIntentos();
    delete intentos[correo.trim().toLowerCase()];
    guardar(CLAVES.intentos, intentos);
  },
};
