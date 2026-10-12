import type { Genero, Rol } from "../types";

export const ROLES: Rol[] = ["administrador", "vendedor", "cliente"];

export const ETIQUETA_ROL: Record<Rol, string> = {
  administrador: "Administrador",
  vendedor: "Vendedor",
  cliente: "Cliente",
};

export const GENEROS: Genero[] = ["Femenino", "Masculino", "Otro", "Prefiero no decirlo"];

/** Reglas de negocio heredadas de la Evaluación 1. */
export const EDAD_MINIMA = 14;
export const DOMINIO_PERMITIDO = "@duoc.cl";
export const MAX_INTENTOS_FALLIDOS = 3;
export const REGEX_PASSWORD = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
export const DOMINIOS_CONTACTO = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

export const IMAGEN_POR_DEFECTO = "img/sin-imagen.svg";
