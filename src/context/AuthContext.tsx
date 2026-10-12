/**
 * context/AuthContext.tsx
 * -----------------------------------------------------------------------
 * Contexto de USUARIOS y SESIÓN. Expone a toda la app:
 *  - el usuario autenticado (y por lo tanto su rol),
 *  - login con bloqueo tras 3 intentos fallidos (regla de EP1),
 *  - registro público (SIEMPRE crea clientes),
 *  - CRUD de usuarios con las restricciones de cada rol (utils/permisos.ts),
 *  - edición del perfil propio (sin poder cambiar el rol).
 * Es un Provider de React: el estado vive en useState y se sincroniza con
 * LocalStorage a través de usuariosRepo.
 * -----------------------------------------------------------------------
 */
import { createContext, useContext, useState, type ReactNode } from "react";
import type { NuevoUsuario, Resultado, Usuario } from "../types";
import { MAX_INTENTOS_FALLIDOS } from "../data/constantes";
import { usuariosRepo, type MapaIntentos } from "../data/usuariosRepo";
import { puede, rolesAsignables, SIN_PERMISO } from "../utils/permisos";

export type DatosPerfil = Omit<NuevoUsuario, "rol" | "password">;

interface AuthValor {
  usuario: Usuario | null;
  usuarios: Usuario[];
  iniciarSesion: (correo: string, password: string) => Resultado;
  cerrarSesion: () => void;
  registrarCliente: (datos: NuevoUsuario) => Resultado;
  crearUsuario: (datos: NuevoUsuario) => Resultado;
  actualizarUsuario: (id: string, datos: Partial<NuevoUsuario>) => Resultado;
  actualizarPerfil: (datos: DatosPerfil) => Resultado;
  eliminarUsuario: (id: string) => Resultado;
  estaBloqueado: (correo: string) => boolean;
  desbloquear: (correo: string) => Resultado;
}

const AuthContext = createContext<AuthValor | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => usuariosRepo.listar());
  const [sesionId, setSesionId] = useState<string | null>(() => usuariosRepo.obtenerSesion());
  const [intentos, setIntentos] = useState<MapaIntentos>(() => usuariosRepo.obtenerIntentos());

  // El usuario autenticado se DERIVA de la lista + el id de sesión (si lo borran, la sesión deja de valer).
  const usuario = usuarios.find((u) => u.id === sesionId) ?? null;

  const refrescar = () => setUsuarios(usuariosRepo.listar());
  const correoEnUsoPorOtro = (correo: string, idPropio?: string) => {
    const existente = usuariosRepo.obtenerPorCorreo(correo);
    return existente !== null && existente.id !== idPropio;
  };

  function estaBloqueado(correo: string): boolean {
    return intentos[correo.trim().toLowerCase()]?.bloqueado === true;
  }

  function iniciarSesion(correo: string, password: string): Resultado {
    if (correo.trim() === "" || password === "") return { ok: false, mensaje: "Ingresa tu correo y contraseña." };
    if (estaBloqueado(correo)) {
      return { ok: false, mensaje: "Tu cuenta está bloqueada por múltiples intentos fallidos. Contacta al administrador." };
    }
    const encontrado = usuariosRepo.obtenerPorCorreo(correo);
    if (encontrado === null || encontrado.password !== password) {
      const estado = usuariosRepo.registrarIntentoFallido(correo);
      setIntentos(usuariosRepo.obtenerIntentos());
      return {
        ok: false,
        mensaje: estado.bloqueado
          ? "Has superado el máximo de intentos permitidos. Tu cuenta ha sido bloqueada."
          : `Correo o contraseña incorrectos. Intentos restantes: ${MAX_INTENTOS_FALLIDOS - estado.fallidos}.`,
      };
    }
    usuariosRepo.reiniciarIntentos(correo);
    setIntentos(usuariosRepo.obtenerIntentos());
    usuariosRepo.iniciarSesion(encontrado.id);
    setSesionId(encontrado.id);
    return { ok: true, mensaje: "Sesión iniciada." };
  }

  function cerrarSesion() {
    usuariosRepo.cerrarSesion();
    setSesionId(null);
  }

  /** Registro público: el rol se fuerza a "cliente" sin importar lo que llegue. */
  function registrarCliente(datos: NuevoUsuario): Resultado {
    if (correoEnUsoPorOtro(datos.correo)) return { ok: false, mensaje: "Ya existe una cuenta con ese correo." };
    usuariosRepo.crear({ ...datos, rol: "cliente" });
    refrescar();
    return { ok: true, mensaje: "¡Cuenta creada con éxito! Ya puedes iniciar sesión." };
  }

  /** Crear usuario desde el panel: el admin elige cualquier rol; el vendedor solo "cliente". */
  function crearUsuario(datos: NuevoUsuario): Resultado {
    if (!puede(usuario?.rol, "usuarios:crear")) return SIN_PERMISO;
    if (!rolesAsignables(usuario?.rol).includes(datos.rol)) {
      return { ok: false, mensaje: "Tu rol solo permite crear usuarios con rol cliente." };
    }
    if (correoEnUsoPorOtro(datos.correo)) return { ok: false, mensaje: "Ya existe una cuenta con ese correo." };
    usuariosRepo.crear(datos);
    refrescar();
    return { ok: true, mensaje: "Usuario creado correctamente." };
  }

  function actualizarUsuario(id: string, datos: Partial<NuevoUsuario>): Resultado {
    if (!puede(usuario?.rol, "usuarios:editar")) return SIN_PERMISO;
    const objetivo = usuariosRepo.obtenerPorId(id);
    if (objetivo === null) return { ok: false, mensaje: "El usuario no existe." };
    if (datos.correo !== undefined && correoEnUsoPorOtro(datos.correo, id)) {
      return { ok: false, mensaje: "Ya existe otra cuenta con ese correo." };
    }
    const cambios = { ...datos };
    if (id === usuario?.id) delete cambios.rol; // nadie puede cambiarse su propio rol
    if (cambios.rol !== undefined && objetivo.rol === "administrador" && cambios.rol !== "administrador") {
      const admins = usuariosRepo.listar().filter((u) => u.rol === "administrador").length;
      if (admins <= 1) return { ok: false, mensaje: "Debe existir al menos un administrador." };
    }
    usuariosRepo.actualizar(id, cambios);
    refrescar();
    return { ok: true, mensaje: "Usuario actualizado correctamente." };
  }

  /** Edición del perfil propio: cualquier usuario autenticado, pero NUNCA su rol ni su contraseña. */
  function actualizarPerfil(datos: DatosPerfil): Resultado {
    if (usuario === null) return SIN_PERMISO;
    if (correoEnUsoPorOtro(datos.correo, usuario.id)) return { ok: false, mensaje: "Ya existe otra cuenta con ese correo." };
    usuariosRepo.actualizar(usuario.id, datos);
    refrescar();
    return { ok: true, mensaje: "Perfil actualizado correctamente." };
  }

  function eliminarUsuario(id: string): Resultado {
    if (!puede(usuario?.rol, "usuarios:eliminar")) return SIN_PERMISO;
    if (id === usuario?.id) return { ok: false, mensaje: "No puedes eliminar tu propia cuenta." };
    if (!usuariosRepo.eliminar(id)) return { ok: false, mensaje: "El usuario no existe." };
    refrescar();
    return { ok: true, mensaje: "Usuario eliminado." };
  }

  function desbloquear(correo: string): Resultado {
    if (!puede(usuario?.rol, "usuarios:editar")) return SIN_PERMISO;
    usuariosRepo.reiniciarIntentos(correo);
    setIntentos(usuariosRepo.obtenerIntentos());
    return { ok: true, mensaje: "Cuenta desbloqueada." };
  }

  const valor: AuthValor = {
    usuario, usuarios, iniciarSesion, cerrarSesion, registrarCliente, crearUsuario,
    actualizarUsuario, actualizarPerfil, eliminarUsuario, estaBloqueado, desbloquear,
  };
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValor {
  const contexto = useContext(AuthContext);
  if (contexto === null) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return contexto;
}
