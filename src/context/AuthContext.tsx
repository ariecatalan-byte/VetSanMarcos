/**
 * context/AuthContext.tsx
 * -----------------------------------------------------------------------
 * Contexto de SESIÓN conectado al backend. Expone a toda la app:
 *  - el usuario autenticado (y por lo tanto su rol),
 *  - login / registro / logout contra la API (JWT + refresh token),
 *  - access token en memoria y refresh token en cookie HttpOnly,
 *  - aviso cuando la sesión expira y no se pudo renovar,
 *  - edición del perfil propio.
 * La gestión de usuarios del panel (listar, crear, editar...) usa api/usuarios.ts directamente.
 * -----------------------------------------------------------------------
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { NuevoUsuario, Resultado, Usuario } from "../types";
import { authApi } from "../api/auth";
import { mensajeDeError, registrarAlExpirarSesion, renovarSesion, tokensSesion } from "../api/cliente";
import { usuariosApi } from "../api/usuarios";

export type DatosPerfil = Omit<NuevoUsuario, "rol" | "password">;

interface AuthValor {
  usuario: Usuario | null;
  /** true mientras se restaura la sesión desde la cookie HttpOnly. */
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
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [sesionExpirada, setSesionExpirada] = useState(false);

  // Si la API ya no puede renovar el token (refresh vencido o revocado), se limpia la sesión y se avisa.
  useEffect(() => {
    registrarAlExpirarSesion(() => {
      tokensSesion.limpiar();
      setUsuario(null);
      setSesionExpirada(true);
    });
    let vigente = true;
    void (async () => {
      try {
        if (await renovarSesion()) {
          const actual = await authApi.yo();
          if (vigente) setUsuario(actual);
        }
      } catch {
        if (vigente) {
          tokensSesion.limpiar();
          setUsuario(null);
        }
      } finally {
        if (vigente) setCargandoSesion(false);
      }
    })();
    return () => {
      vigente = false;
      registrarAlExpirarSesion(null);
    };
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
    tokensSesion.limpiar();
    setUsuario(null);
    setSesionExpirada(false);
    try { await authApi.cerrarSesion(); } catch { /* La interfaz se cierra aunque el backend no responda. */ }
  }, []);

  /** El backend crea clientes y entrega una sesión nueva al registrarlos. */
  const registrarCliente = useCallback(async (datos: NuevoUsuario): Promise<Resultado> => {
    try {
      const sesion = await authApi.registro({ ...datos, rol: "cliente" });
      tokensSesion.guardar(sesion);
      setSesionExpirada(false);
      setUsuario(sesion.usuario);
      return { ok: true, mensaje: "¡Cuenta creada con éxito!" };
    } catch (error) {
      return { ok: false, mensaje: mensajeDeError(error) };
    }
  }, []);

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
