/**
 * admin/StockEditor.tsx
 * Edición rápida de stock dentro de la tabla de productos. Es la operación que
 * puede hacer el VENDEDOR (además de consultar); por eso es un componente
 * aparte del formulario completo de producto, que solo usa el administrador.
 */
import { useState } from "react";
import type { Producto, Resultado } from "../../types";
import { validarStock } from "../../utils/validaciones";

interface Props {
  producto: Producto;
  onGuardar: (id: string, stock: number) => Resultado;
}

export function StockEditor({ producto, onGuardar }: Props) {
  const [valor, setValor] = useState(String(producto.stock));
  const [mensaje, setMensaje] = useState<Resultado | null>(null);
  const error = validarStock(valor);
  const sinCambios = valor === String(producto.stock);

  function guardar() {
    if (error) return;
    setMensaje(onGuardar(producto.id, Number(valor)));
    setTimeout(() => setMensaje(null), 2000);
  }

  return (
    <div style={{ minWidth: 170 }}>
      <div className="input-group input-group-sm">
        <input type="number" min={0} className={"form-control" + (error ? " is-invalid" : "")} value={valor}
          aria-label={`Stock de ${producto.nombre}`} onChange={(e) => setValor(e.target.value)} />
        <button type="button" className="btn btn-outline-primary" disabled={sinCambios || error !== undefined} onClick={guardar}>Guardar</button>
      </div>
      {error && <div className="mensaje-error">{error}</div>}
      {mensaje && <div className={mensaje.ok ? "text-success small" : "mensaje-error"}>{mensaje.mensaje}</div>}
    </div>
  );
}
