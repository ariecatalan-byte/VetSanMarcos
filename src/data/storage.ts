/**
 * data/storage.ts
 * -----------------------------------------------------------------------
 * Acceso genérico a LocalStorage (persistencia de la aplicación).
 * Todos los repositorios (productosRepo, usuariosRepo, ...) usan estas
 * dos funciones, de modo que si un dato está corrupto la app no se cae.
 *
 * Las claves llevan el sufijo "_v2" para no mezclarse con los datos que
 * la Evaluación 1 guardó en el mismo navegador (usuarios sin rol, etc.).
 * -----------------------------------------------------------------------
 */
export const CLAVES = {
  productos: "vsm_v2_productos",
  categorias: "vsm_v2_categorias",
  usuarios: "vsm_v2_usuarios",
  ordenes: "vsm_v2_ordenes",
  carrito: "vsm_v2_carrito",
  sesion: "vsm_v2_sesion",
  intentos: "vsm_v2_intentos_login",
} as const;

export function leer<T>(clave: string, porDefecto: T): T {
  try {
    const dato = localStorage.getItem(clave);
    return dato === null ? porDefecto : (JSON.parse(dato) as T);
  } catch {
    return porDefecto;
  }
}

export function guardar<T>(clave: string, valor: T): void {
  localStorage.setItem(clave, JSON.stringify(valor));
}

export function borrar(clave: string): void {
  localStorage.removeItem(clave);
}

export function existe(clave: string): boolean {
  return localStorage.getItem(clave) !== null;
}

/** Genera el siguiente id correlativo con prefijo: ("P", ["P001","P004"]) → "P005". */
export function siguienteId(prefijo: string, idsExistentes: string[]): string {
  const maximo = idsExistentes.reduce((max, id) => {
    const numero = parseInt(id.replace(prefijo, ""), 10);
    return Number.isNaN(numero) ? max : Math.max(max, numero);
  }, 0);
  return prefijo + String(maximo + 1).padStart(3, "0");
}
