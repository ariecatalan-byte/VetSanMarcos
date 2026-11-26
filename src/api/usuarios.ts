import type { NuevoUsuario, Usuario } from "../types";
import type { DatosPerfil } from "../context/AuthContext";
import { http } from "./cliente";

export const usuariosApi = {
  listar: () => http.get<Usuario[]>("/usuarios"),
  obtener: (id: string) => http.get<Usuario>(`/usuarios/${id}`),
  crear: (d: NuevoUsuario) => http.post<Usuario>("/usuarios", d),
  actualizar: (id: string, d: Partial<NuevoUsuario>) => http.put<Usuario>(`/usuarios/${id}`, d),
  eliminar: (id: string) => http.delete(`/usuarios/${id}`),
  desbloquear: (id: string) => http.patch<Usuario>(`/usuarios/${id}/desbloquear`),
  actualizarPerfil: (d: DatosPerfil) => http.put<Usuario>("/usuarios/me", d),
};
