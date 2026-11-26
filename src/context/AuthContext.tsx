/**
 * context/AuthContext.tsx
 * -----------------------------------------------------------------------
 * Contexto de SESIÓN conectado al backend. Expone a toda la app:
 *  - el usuario autenticado (y por lo tanto su rol),
 *  - login / registro / logout contra la API (JWT + refresh token),
 *  - tokens JWT mantenidos solo en memoria durante la sesión actual,
 *  - aviso cuando la sesión expira y no se pudo renovar,
 *  - edición del perfil propio.
 * La gestión de usuarios del panel (listar, crear, editar...) usa api/usuarios.ts directamente.
 * -----------------------------------------------------------------------
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { NuevoUsuario, Resultado, Usuario } from "../types";
import { authApi } from "../api/auth";
import { comoResultado, mensajeDeError, registrarAlExpirarSesion, tokensSesion } from "../api/cliente";
import { usuariosApi } from "../api/usuarios";

export type DatosPerfil = Omit<NuevoUsuario, "rol" | "password">;

interface AuthValor {
  usuario: Usuario | null;
  /** Se conserva para que las rutas protegidas puedan mostrar el estado de carga. */
  cargandoSesion: boolean;
  /** true si la sesión terminó porque el token expiró y no se pudo renovar. */
  sesionExpirada: boolean;
  iniciarSesion: (correo: string, password: string) => Promise<Resultado>;
  cerrarSesion: () => Promise<void>;
  registrarCliente: (datos: NuevoUsuario) => Promise<Resultado>;
  actualizarPerfil: (datos: DatosPerfil) => Promise<Resultado>;
}

const AuthContext = createContext<AuthValor | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const cargandoSesion = false;
  const [sesionExpirada, setSesionExpirada] = useState(false);

  // Si la API ya no puede renovar el token (refresh vencido o revocado), se limpia la sesión y se avisa.
  useEffect(() => {
    registrarAlExpirarSesion(() => {
      tokensSesion.limpiar();
      setUsuario(null);
      setSesionExpirada(true);
    });
    return () => registrarAlExpirarSesion(null);
  }, []);

  const iniciarSesion = useCallback(async (correo: string, password: string): Promise<Resultado> => {
    if (correo.trim() === "" || password === "") return { ok: false, mensaje: "Ingresa tu correo y contraseña." };
    try {
      const sesion = await authApi.login(correo.trim(), password);
      tokensSesion.guardar(sesion);
      setSesionExpirada(false);
      setUsuario(sesion.usuario);
      return { ok: true, mensaje: "Sesión iniciada." };
    } catch (e) {
      return { ok: false, mensaje: mensajeDeError(e) };
    }
  }, []);

  const cerrarSesion = useCallback(async () => {
    const refresh = tokensSesion.obtenerRefresh();
    tokensSesion.limpiar();
    setUsuario(null);
    setSesionExpirada(false);
    if (refresh !== null) {
      try { await authApi.cerrarSesion(refresh); } catch { /* si falla la red, igual queda cerrada localmente */ }
    }
  }, []);

  /** Registro público: el backend SIEMPRE crea clientes. No se inicia sesión automáticamente. */
  const registrarCliente = useCallback(
    (datos: NuevoUsuario) => comoResultado(() => authApi.registro({ ...datos, rol: "cliente" }), "¡Cuenta creada con éxito! Ya puedes iniciar sesión."),
    [],
  );

  const actualizarPerfil = useCallback(async (datos: DatosPerfil): Promise<Resultado> => {
    try {
      setUsuario(await usuariosApi.actualizarPerfil(datos));
      return { ok: true, mensaje: "Perfil actualizado correctamente." };
    } catch (e) {
      return { ok: false, mensaje: mensajeDeError(e) };
    }
  }, []);

  const valor = useMemo<AuthValor>(
    () => ({ usuario, cargandoSesion, sesionExpirada, iniciarSesion, cerrarSesion, registrarCliente, actualizarPerfil }),
    [usuario, cargandoSesion, sesionExpirada, iniciarSesion, cerrarSesion, registrarCliente, actualizarPerfil],
  );
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValor {
  const contexto = useContext(AuthContext);
  if (contexto === null) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return contexto;
}
