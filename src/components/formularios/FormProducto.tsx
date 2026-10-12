/**
 * formularios/FormProducto.tsx
 * Formulario de producto (crear / editar) del administrador. Los campos
 * numéricos se manejan como texto en el formulario y se convierten a
 * número solo al guardar (así se puede validar lo que el usuario escribe).
 */
import { useState } from "react";
import type { Categoria, NuevoProducto, Producto, Resultado } from "../../types";
import { useFormulario } from "../../hooks/useFormulario";
import { validarProducto, type DatosFormProducto } from "../../utils/validaciones";
import { Alerta } from "../comunes/Alerta";
import { CampoInput, CampoSelect } from "../comunes/Campos";

interface Props {
  productoInicial?: Producto;
  categorias: Categoria[];
  textoBoton: string;
  onGuardar: (datos: NuevoProducto) => Resultado;
  onExito?: () => void;
}

function aValores(p?: Producto): DatosFormProducto {
  return {
    nombre: p?.nombre ?? "",
    categoriaId: p?.categoriaId ?? "",
    especie: p?.especie ?? "",
    precio: p ? String(p.precio) : "",
    descuento: p ? String(p.descuento) : "0",
    stock: p ? String(p.stock) : "",
    stockCritico: p ? String(p.stockCritico) : "5",
    descripcion: p?.descripcion ?? "",
    imagen: p?.imagen ?? "",
  };
}

export function FormProducto({ productoInicial, categorias, textoBoton, onGuardar, onExito }: Props) {
  const form = useFormulario<DatosFormProducto>(aValores(productoInicial), validarProducto);
  const { valores, cambiar, errorDe } = form;
  const [resultado, setResultado] = useState<Resultado | null>(null);

  function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    setResultado(null);
    if (!form.intentarEnvio()) {
      setResultado({ ok: false, mensaje: "Revisa los campos marcados en rojo antes de continuar." });
      return;
    }
    const respuesta = onGuardar({
      nombre: valores.nombre.trim(),
      categoriaId: valores.categoriaId,
      especie: valores.especie.trim(),
      precio: Number(valores.precio),
      descuento: Number(valores.descuento),
      stock: Number(valores.stock),
      stockCritico: Number(valores.stockCritico),
      descripcion: valores.descripcion.trim(),
      imagen: valores.imagen.trim(),
    });
    setResultado(respuesta);
    if (respuesta.ok) {
      if (productoInicial === undefined) form.reiniciar(aValores());
      onExito?.();
    }
  }

  return (
    <form onSubmit={alEnviar} noValidate>
      <div className="row g-3">
        <div className="col-md-8">
          <CampoInput id="p-nombre" etiqueta="Nombre del producto" valor={valores.nombre} maxLength={100} error={errorDe("nombre")} onCambio={(v) => cambiar("nombre", v)} />
        </div>
        <div className="col-md-4">
          <CampoSelect id="p-categoria" etiqueta="Categoría" placeholder="-- Seleccione --" valor={valores.categoriaId} error={errorDe("categoriaId")}
            opciones={categorias.map((c) => ({ valor: c.id, etiqueta: c.nombre }))} onCambio={(v) => cambiar("categoriaId", v)} />
        </div>
        <div className="col-md-4">
          <CampoInput id="p-especie" etiqueta="Especie" placeholder="Perro / Gato" valor={valores.especie} error={errorDe("especie")} onCambio={(v) => cambiar("especie", v)} />
        </div>
        <div className="col-6 col-md-4">
          <CampoInput id="p-precio" tipo="number" min={1} etiqueta="Precio (CLP)" valor={valores.precio} error={errorDe("precio")} onCambio={(v) => cambiar("precio", v)} />
        </div>
        <div className="col-6 col-md-4">
          <CampoInput id="p-descuento" tipo="number" min={0} max={90} etiqueta="Descuento (%)" valor={valores.descuento} error={errorDe("descuento")}
            ayuda="Mayor a 0 = aparece en Ofertas." onCambio={(v) => cambiar("descuento", v)} />
        </div>
        <div className="col-6 col-md-4">
          <CampoInput id="p-stock" tipo="number" min={0} etiqueta="Stock" valor={valores.stock} error={errorDe("stock")} onCambio={(v) => cambiar("stock", v)} />
        </div>
        <div className="col-6 col-md-4">
          <CampoInput id="p-stockCritico" tipo="number" min={0} etiqueta="Stock crítico" valor={valores.stockCritico} error={errorDe("stockCritico")}
            ayuda="Bajo este valor se avisa como crítico." onCambio={(v) => cambiar("stockCritico", v)} />
        </div>
        <div className="col-md-4">
          <CampoInput id="p-imagen" etiqueta="Imagen (ruta o URL, opcional)" placeholder="img/productos/p001.png" valor={valores.imagen}
            onCambio={(v) => cambiar("imagen", v)} />
        </div>
        <div className="col-12">
          <CampoInput id="p-descripcion" multilinea filas={4} etiqueta="Descripción" valor={valores.descripcion} maxLength={500}
            error={errorDe("descripcion")} onCambio={(v) => cambiar("descripcion", v)} />
        </div>
        <div className="col-12 d-grid d-md-block">
          <button type="submit" className="btn btn-primary">{textoBoton}</button>
        </div>
      </div>
      {resultado && <Alerta tipo={resultado.ok ? "success" : "danger"} className="mt-3 mb-0">{resultado.mensaje}</Alerta>}
    </form>
  );
}
