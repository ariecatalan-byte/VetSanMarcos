import type { NuevoUsuario } from "../types";
import type { DatosFormUsuario } from "./validaciones";

/** Convierte los valores del formulario (ya validados) en un usuario listo para guardar. */
export function aNuevoUsuario(d: DatosFormUsuario): NuevoUsuario {
  return {
    nombre: d.nombre.trim(),
    apellido: d.apellido.trim(),
    fechaNacimiento: d.fechaNacimiento,
    genero: d.genero === "" ? "Prefiero no decirlo" : d.genero,
    correo: d.correo.trim(),
    password: d.password,
    direccion: d.direccion.trim(),
    region: d.region,
    comuna: d.comuna,
    rol: d.rol,
  };
}
