/** CRUD de categorías (solo administrador). El formulario sirve para crear y, al elegir "Editar", para modificar. */
import { useState } from "react";
import { Alerta } from "../../components/comunes/Alerta";
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { FormCategoria } from "../../components/formularios/FormCategoria";
import { useDatos } from "../../context/DatosContext";
import type { Categoria, Resultado } from "../../types";

export function CategoriasAdmin() {
  const { categorias, productos, crearCategoria, actualizarCategoria, eliminarCategoria } = useDatos();
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [aviso, setAviso] = useState<Resultado | null>(null);

  function eliminar(c: Categoria) {
    if (window.confirm(`¿Eliminar la categoría "${c.nombre}"?`)) {
      setAviso(eliminarCategoria(c.id));
      if (editando?.id === c.id) setEditando(null);
    }
  }

  return (
    <>
      <EncabezadoPagina titulo="Categorías" descripcion="Organiza los productos en categorías para facilitar la navegación." />
      <div className="card border-0 shadow-sm mb-4"><div className="card-body p-4">
        <h2 className="h5 fw-bold mb-3">{editando ? `Editando: ${editando.nombre}` : "Nueva categoría"}</h2>
        <FormCategoria key={editando?.id ?? "nueva"} categoriaInicial={editando ?? undefined} categorias={categorias}
          onGuardar={(d) => {
            const r = editando ? actualizarCategoria(editando.id, d) : crearCategoria(d);
            if (r.ok && editando) setEditando(null);
            return r;
          }}
          onCancelar={editando ? () => setEditando(null) : undefined} />
      </div></div>

      {aviso && <Alerta tipo={aviso.ok ? "success" : "danger"} onCerrar={() => setAviso(null)}>{aviso.mensaje}</Alerta>}

      <div className="table-responsive">
        <table className="table align-middle bg-white">
          <thead><tr><th>Nombre</th><th>Descripción</th><th className="text-end">Productos</th><th /></tr></thead>
          <tbody>
            {categorias.map((c) => (
              <tr key={c.id}>
                <td className="fw-semibold">{c.nombre}</td>
                <td>{c.descripcion}</td>
                <td className="text-end">{productos.filter((p) => p.categoriaId === c.id).length}</td>
                <td className="text-end text-nowrap">
                  <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={() => { setAviso(null); setEditando(c); }}>Editar</button>
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => eliminar(c)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
