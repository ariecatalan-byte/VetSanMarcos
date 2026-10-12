/**
 * utils/permisos.ts
 * -----------------------------------------------------------------------
 * Matriz de permisos por rol (Evaluación 2). Es la ÚNICA fuente de verdad:
 * la usan el menú (qué opciones mostrar), las rutas protegidas (qué
 * páginas dejar entrar) y los contextos (qué operaciones aceptar).
 *
 *  administrador: CRUD de usuarios, productos y categorías; asigna roles.
 *  vendedor:      consulta productos y modifica su stock; crea usuarios
 *                 SOLO con rol cliente. No gestiona categorías, no elimina
 *                 productos ni asigna roles administrador/vendedor.
 *  cliente:       solo funcionalidades comerciales (navegar, comprar, perfil).
 * -----------------------------------------------------------------------
 */
import type { Rol } from "../types";

export type Accion =
  | "panel:acceder"
  | "usuarios:listar"
  | "usuarios:crear"
  | "usuarios:editar"
  | "usuarios:eliminar"
  | "usuarios:asignar-rol"
  | "productos:ver"
  | "productos:crear"
  | "productos:editar"
  | "productos:eliminar"
  | "productos:stock"
  | "categorias:gestionar"
  | "ordenes:ver"
  | "reportes:ver";

const PERMISOS: Record<Rol, Accion[]> = {
  administrador: [
    "panel:acceder", "usuarios:listar", "usuarios:crear", "usuarios:editar", "usuarios:eliminar", "usuarios:asignar-rol",
    "productos:ver", "productos:crear", "productos:editar", "productos:eliminar", "productos:stock",
    "categorias:gestionar", "ordenes:ver", "reportes:ver",
  ],
  vendedor: ["panel:acceder", "usuarios:crear", "productos:ver", "productos:stock"],
  cliente: [],
};

export function puede(rol: Rol | undefined, accion: Accion): boolean {
  return rol !== undefined && PERMISOS[rol].includes(accion);
}

/** Roles que un usuario puede asignar al crear una cuenta. */
export function rolesAsignables(rol: Rol | undefined): Rol[] {
  if (puede(rol, "usuarios:asignar-rol")) return ["administrador", "vendedor", "cliente"];
  if (puede(rol, "usuarios:crear")) return ["cliente"];
  return [];
}

export const SIN_PERMISO = { ok: false, mensaje: "No tienes permiso para realizar esta operación." } as const;
