import type { NuevoUsuario } from "../types";
import { http, type SesionApi } from "./cliente";
import type { Usuario } from "../types";

/** Cuerpo que espera la API para usuarios (el rol solo lo respeta el panel de administración). */
export const aCuerpoUsuario = (d: Partial<NuevoUsuario>) => ({ ...d });

export const authApi = {
  login: (correo: string, password: string) => http.post<SesionApi>("/auth/login", { correo, password }, false),
  registro: (datos: NuevoUsuario) => http.post<SesionApi>("/auth/register", aCuerpoUsuario(datos), false),
  refrescar: (refreshToken: string) => http.post<SesionApi>("/auth/refresh", { refreshToken }, false),
  cerrarSesion: (refreshToken: string) => http.post<void>("/auth/logout", { refreshToken }, false),
  yo: () => http.get<Usuario>("/auth/me"),
};
