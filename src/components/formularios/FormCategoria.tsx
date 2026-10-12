import { useState } from "react";
import type { Categoria, Resultado } from "../../types";
import { useFormulario } from "../../hooks/useFormulario";
import { validarCategoria, type DatosFormCategoria } from "../../utils/validaciones";
import { Alerta } from "../comunes/Alerta";
import { CampoInput } from "../comunes/Campos";

interface Props {
  categoriaInicial?: Categoria;
  /** Categorías existentes, para impedir nombres repetidos. */
  categorias: Categoria[];
  onGuardar: (datos: DatosFormCategoria) => Resultado;
  onCancelar?: () => void;
}

/** Formulario de categoría (nueva / editar). Se muestra dentro de la página de categorías. */
export function FormCategoria({ categoriaInicial, categorias, onGuardar, onCancelar }: Props) {
  const nombresEnUso = categorias.filter((c) => c.id !== categoriaInicial?.id).map((c) => c.nombre.trim().toLowerCase());
  const inicial: DatosFormCategoria = { nombre: categoriaInicial?.nombre ?? "", descripcion: categoriaInicial?.descripcion ?? "" };
  const form = useFormulario<DatosFormCategoria>(inicial, (v) => validarCategoria(v, nombresEnUso));
  const { valores, cambiar, errorDe } = form;
  const [resultado, setResultado] = useState<Resultado | null>(null);

  function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.intentarEnvio()) return;
    const respuesta = onGuardar({ nombre: valores.nombre.trim(), descripcion: valores.descripcion.trim() });
    setResultado(respuesta);
    if (respuesta.ok && categoriaInicial === undefined) form.reiniciar({ nombre: "", descripcion: "" });
  }

  return (
    <form onSubmit={alEnviar} noValidate>
      <div className="row g-3">
        <div className="col-md-4">
          <CampoInput id="c-nombre" etiqueta="Nombre" maxLength={40} valor={valores.nombre} error={errorDe("nombre")} onCambio={(v) => cambiar("nombre", v)} />
        </div>
        <div className="col-md-5">
          <CampoInput id="c-descripcion" etiqueta="Descripción" maxLength={200} valor={valores.descripcion} error={errorDe("descripcion")}
            onCambio={(v) => cambiar("descripcion", v)} />
        </div>
        <div className="col-md-3 d-flex align-items-end gap-2">
          <button type="submit" className="btn btn-primary">{categoriaInicial ? "Guardar cambios" : "Crear categoría"}</button>
          {onCancelar && <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>Cancelar</button>}
        </div>
      </div>
      {resultado && <Alerta tipo={resultado.ok ? "success" : "danger"} className="mt-3 mb-0">{resultado.mensaje}</Alerta>}
    </form>
  );
}
