interface AvatarProps {
  nombre: string;
  apellido: string;
  tamano?: number;
}

/** Avatar genérico: círculo con las iniciales del usuario. */
export function Avatar({ nombre, apellido, tamano = 72 }: AvatarProps) {
  const iniciales = (nombre.charAt(0) + apellido.charAt(0)).toUpperCase();
  return (
    <div className="avatar-generico" style={{ width: tamano, height: tamano, fontSize: tamano / 2.4 }} aria-hidden="true">
      {iniciales}
    </div>
  );
}
