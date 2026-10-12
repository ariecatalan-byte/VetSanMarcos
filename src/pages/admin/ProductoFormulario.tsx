import { Link, useNavigate, useParams } from "react-router-dom";
import { Alerta } from "../../components/comunes/Alerta";
import { EncabezadoPagina } from "../../components/comunes/EncabezadoPagina";
import { FormProducto } from "../../components/formularios/FormProducto";
import { useDatos } from "../../context/DatosContext";

/** Nuevo producto (/admin/productos/nuevo) y Editar producto (/admin/productos/:id/editar): misma página, distinto modo. */
export function ProductoFormulario() {
  const { id } = useParams<{ id: string }>();
  const { productos, categorias, crearProducto, actualizarProducto } = useDatos();
  const navegar = useNavigate();
  const editando = id !== undefined;
  const producto = productos.find((p) => p.id === id);

  return (
    <>
      <EncabezadoPagina titulo={editando ? "Editar producto" : "Nuevo producto"} acciones={<Link to="/admin/productos" className="btn btn-outline-secondary">&larr; Volver</Link>} />
      {editando && producto === undefined ? (
        <Alerta tipo="warning">El producto no existe.</Alerta>
      ) : categorias.length === 0 ? (
        <Alerta tipo="warning">Primero crea al menos una categoría.</Alerta>
      ) : (
        <div className="card border-0 shadow-sm"><div className="card-body p-4">
          <FormProducto key={id ?? "nuevo"} productoInicial={producto} categorias={categorias}
            textoBoton={editando ? "Guardar cambios" : "Crear producto"}
            onGuardar={(datos) => (editando && id !== undefined ? actualizarProducto(id, datos) : crearProducto(datos))}
            onExito={() => editando && setTimeout(() => navegar("/admin/productos"), 900)} />
        </div></div>
      )}
    </>
  );
}
