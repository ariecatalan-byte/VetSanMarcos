/**
 * utils/validaciones.ts
 * -----------------------------------------------------------------------
 * Funciones PURAS de validación de todos los formularios. Reciben los
 * valores del formulario y devuelven un objeto con un mensaje por cada
 * campo inválido (objeto vacío = formulario válido).
 * Reglas heredadas de la Evaluación 1: edad mínima, dominio @duoc.cl,
 * formato de contraseña, región/comuna, condiciones, etc.
 * -----------------------------------------------------------------------
 */
import type { Errores, Genero, Rol } from "../types";
import { DOMINIO_PERMITIDO, DOMINIOS_CONTACTO, EDAD_MINIMA, REGEX_PASSWORD } from "../data/constantes";

/* --------------------------- tipos de formulario --------------------------- */
export interface DatosFormUsuario {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  genero: Genero | "";
  correo: string;
  password: string;
  confirmarPassword: string;
  direccion: string;
  region: string;
  comuna: string;
  rol: Rol;
  aceptaCondiciones: boolean;
}

export type ModoFormUsuario = "registro" | "admin-crear" | "admin-editar" | "perfil";

export interface DatosFormProducto {
  nombre: string;
  categoriaId: string;
  especie: string;
  precio: string;
  descuento: string;
  stock: string;
  stockCritico: string;
  descripcion: string;
  imagen: string;
}

export interface DatosFormCategoria {
  nombre: string;
  descripcion: string;
}

export interface DatosFormContacto {
  nombre: string;
  correo: string;
  mensaje: string;
}

export interface DatosFormCheckout {
  nombre: string;
  apellidos: string;
  correo: string;
  calle: string;
  departamento: string;
  region: string;
  comuna: string;
  indicaciones: string;
  resultadoPago: "aprobado" | "rechazado";
}

/* ------------------------------- utilidades ------------------------------- */
/** Calcula la edad a partir de "AAAA-MM-DD". Retorna null si el formato no es válido. */
export function calcularEdad(fechaNacimiento: string, hoy: Date = new Date()): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimiento)) return null;
  const [anio, mes, dia] = fechaNacimiento.split("-").map(Number);
  let edad = hoy.getFullYear() - anio;
  const diferenciaMes = hoy.getMonth() + 1 - mes;
  if (diferenciaMes < 0 || (diferenciaMes === 0 && hoy.getDate() < dia)) edad--;
  return edad;
}

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* -------------------------------- usuarios -------------------------------- */
export interface ContextoValidacionUsuario {
  modo: ModoFormUsuario;
  /** Correos ya registrados por OTROS usuarios (en minúsculas). */
  correosEnUso: string[];
}

export function validarUsuario(v: DatosFormUsuario, ctx: ContextoValidacionUsuario): Errores<DatosFormUsuario> {
  const e: Errores<DatosFormUsuario> = {};
  const nombre = v.nombre.trim();
  const apellido = v.apellido.trim();
  const correo = v.correo.trim();
  const direccion = v.direccion.trim();

  if (nombre === "" || nombre.length > 50) e.nombre = "El nombre es obligatorio (máximo 50 caracteres).";
  if (apellido === "" || apellido.length > 100) e.apellido = "El apellido es obligatorio (máximo 100 caracteres).";

  if (v.fechaNacimiento === "") {
    e.fechaNacimiento = "Debes indicar la fecha de nacimiento.";
  } else {
    const edad = calcularEdad(v.fechaNacimiento);
    if (edad === null || edad < EDAD_MINIMA) e.fechaNacimiento = `Debes tener al menos ${EDAD_MINIMA} años.`;
  }

  if (v.genero === "") e.genero = "Selecciona una opción de género.";

  if (correo === "") e.correo = "El correo es obligatorio.";
  else if (correo.length > 100) e.correo = "El correo no puede superar los 100 caracteres.";
  else if (!correo.toLowerCase().endsWith(DOMINIO_PERMITIDO)) e.correo = `Solo se aceptan correos institucionales ${DOMINIO_PERMITIDO}`;
  else if (!REGEX_CORREO.test(correo)) e.correo = "El formato del correo no es válido.";
  else if (ctx.correosEnUso.includes(correo.toLowerCase())) e.correo = "Ya existe una cuenta registrada con este correo.";

  // Contraseña: obligatoria al crear; al editar un usuario (admin) es opcional; el perfil no la pide.
  if (ctx.modo === "registro" || ctx.modo === "admin-crear" || (ctx.modo === "admin-editar" && v.password !== "")) {
    if (!REGEX_PASSWORD.test(v.password)) e.password = "Mínimo 8 caracteres, con al menos 1 letra y 1 número.";
    if (v.confirmarPassword === "" || v.confirmarPassword !== v.password) e.confirmarPassword = "Las contraseñas no coinciden.";
  }

  if (direccion === "" || direccion.length > 300) e.direccion = "La dirección es obligatoria (máximo 300 caracteres).";
  if (v.region === "") e.region = "Selecciona una región.";
  if (v.comuna === "") e.comuna = "Selecciona una comuna.";

  if (ctx.modo === "registro" && !v.aceptaCondiciones) e.aceptaCondiciones = "Debes aceptar las condiciones de registro.";
  return e;
}

/* -------------------------------- productos -------------------------------- */
function esEnteroEntre(texto: string, min: number, max: number): boolean {
  return /^\d+$/.test(texto.trim()) && Number(texto) >= min && Number(texto) <= max;
}

export function validarProducto(v: DatosFormProducto): Errores<DatosFormProducto> {
  const e: Errores<DatosFormProducto> = {};
  if (v.nombre.trim() === "" || v.nombre.trim().length > 100) e.nombre = "El nombre es obligatorio (máximo 100 caracteres).";
  if (v.categoriaId === "") e.categoriaId = "Selecciona una categoría.";
  if (v.especie.trim() === "") e.especie = "Indica la especie (ej: Perro, Gato, Perro / Gato).";
  if (!esEnteroEntre(v.precio, 1, 10_000_000)) e.precio = "El precio debe ser un número entero mayor a 0.";
  if (!esEnteroEntre(v.descuento, 0, 90)) e.descuento = "El descuento debe ser un entero entre 0 y 90.";
  if (!esEnteroEntre(v.stock, 0, 100_000)) e.stock = "El stock debe ser un entero mayor o igual a 0.";
  if (!esEnteroEntre(v.stockCritico, 0, 100_000)) e.stockCritico = "El stock crítico debe ser un entero mayor o igual a 0.";
  if (v.descripcion.trim() === "" || v.descripcion.length > 500) e.descripcion = "La descripción es obligatoria (máximo 500 caracteres).";
  return e;
}

/** Validación del campo de stock cuando se modifica solo el stock (rol vendedor o edición rápida). */
export function validarStock(texto: string): string | undefined {
  return esEnteroEntre(texto, 0, 100_000) ? undefined : "El stock debe ser un entero mayor o igual a 0.";
}

/* ------------------------------- categorías ------------------------------- */
export function validarCategoria(v: DatosFormCategoria, nombresEnUso: string[]): Errores<DatosFormCategoria> {
  const e: Errores<DatosFormCategoria> = {};
  const nombre = v.nombre.trim();
  if (nombre.length < 3 || nombre.length > 40) e.nombre = "El nombre debe tener entre 3 y 40 caracteres.";
  else if (nombresEnUso.includes(nombre.toLowerCase())) e.nombre = "Ya existe una categoría con ese nombre.";
  if (v.descripcion.length > 200) e.descripcion = "La descripción no puede superar los 200 caracteres.";
  return e;
}

/* -------------------------------- contacto -------------------------------- */
export function validarContacto(v: DatosFormContacto): Errores<DatosFormContacto> {
  const e: Errores<DatosFormContacto> = {};
  const correo = v.correo.trim().toLowerCase();
  if (v.nombre.trim() === "" || v.nombre.length > 100) e.nombre = "El nombre es obligatorio (máximo 100 caracteres).";
  if (correo !== "" && (correo.length > 100 || !DOMINIOS_CONTACTO.some((d) => correo.endsWith(d)))) {
    e.correo = "Ingresa un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).";
  }
  if (v.mensaje.trim() === "" || v.mensaje.length > 500) e.mensaje = "El mensaje es obligatorio (máximo 500 caracteres).";
  return e;
}

/* -------------------------------- checkout -------------------------------- */
export function validarCheckout(v: DatosFormCheckout): Errores<DatosFormCheckout> {
  const e: Errores<DatosFormCheckout> = {};
  if (v.nombre.trim() === "" || v.nombre.length > 50) e.nombre = "El nombre es obligatorio.";
  if (v.apellidos.trim() === "" || v.apellidos.length > 100) e.apellidos = "Los apellidos son obligatorios.";
  if (!REGEX_CORREO.test(v.correo.trim())) e.correo = "Ingresa un correo válido.";
  if (v.calle.trim() === "" || v.calle.length > 200) e.calle = "La calle es obligatoria.";
  if (v.region === "") e.region = "Selecciona una región.";
  if (v.comuna === "") e.comuna = "Selecciona una comuna.";
  if (v.indicaciones.length > 300) e.indicaciones = "Máximo 300 caracteres.";
  return e;
}
