import { rutaImagen } from "../../utils/formato";

interface Props {
  src: string;
  alt: string;
  className?: string;
}

/** <img> que usa la imagen por defecto si la ruta falla. */
export function ImagenProducto({ src, alt, className }: Props) {
  return (
    <img
      src={rutaImagen(src)}
      alt={alt}
      className={className}
      onError={(e) => {
        const defecto = rutaImagen("");
        if (e.currentTarget.src !== new URL(defecto, window.location.href).href) e.currentTarget.src = defecto;
      }}
    />
  );
}
