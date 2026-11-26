/**
 * types/index.ts
 * -----------------------------------------------------------------------
 * Tipos e interfaces de TODO el dominio de la tienda. Se usan para:
 *  - tipar las respuestas y peticiones de la API REST (api/),
 *  - tipar las props de los componentes,
 *  - tipar los estados (useState) y los valores de los contextos.
 * -----------------------------------------------------------------------
 */

/** Los tres roles del sistema (Evaluación 2). */
export type Rol = "administrador" | "vendedor" | "cliente";

export type Genero = "Femenino" | "Masculino" | "Otro" | "Prefiero no decirlo";

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // formato AAAA-MM-DD (input type="date")
  genero: Genero;
  correo: string;
  direccion: string;
  region: string;
  comuna: string;
  rol: Rol;
  /** Bloqueada por 3 intentos fallidos (la desbloquea un administrador). */
  bloqueado: boolean;
  /** false = cuenta desactivada (tiene compras, por eso no se borró). */
  activo: boolean;
}

/** Datos para crear/registrar un usuario. La contraseña SOLO viaja al servidor; la API nunca la devuelve. */
export type NuevoUsuario = Omit<Usuario, "id" | "bloqueado" | "activo"> & { password: string };

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface Producto {
  id: string;
  nombre: string;
  categoriaId: string;
  especie: string;
  precio: number; // precio normal en CLP
  descuento: number; // porcentaje 0-90; > 0 significa que está en oferta
  stock: number;
  stockCritico: number;
  descripcion: string;
  imagen: string; // ruta relativa dentro de /public o URL
}

export type NuevoProducto = Omit<Producto, "id">;

/** Lo que se guarda del carrito: solo id y cantidad (el resto se obtiene del producto). */
export interface ItemCarrito {
  idProducto: string;
  cantidad: number;
}

/** Ítem del carrito ya "resuelto" con los datos del producto, listo para mostrar. */
export interface LineaCarrito {
  producto: Producto;
  cantidad: number;
  precioUnitario: number; // precio con descuento aplicado
  subtotal: number;
}

export interface LineaOrden {
  idProducto: string;
  nombre: string;
  imagen: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface DatosCliente {
  nombre: string;
  apellidos: string;
  correo: string;
}

export interface DireccionEntrega {
  calle: string;
  departamento: string;
  region: string;
  comuna: string;
  indicaciones: string;
}

/** pagada → enviada → entregada; pagada/enviada → cancelada; rechazada es terminal. */
export type EstadoOrden = "pagada" | "enviada" | "entregada" | "cancelada" | "rechazada";

export interface Orden {
  id: string;
  numero: number; // número visible de boleta
  fecha: string; // ISO
  estado: EstadoOrden;
  usuarioId: string; // toda compra pertenece a un usuario autenticado
  cliente: DatosCliente;
  entrega: DireccionEntrega;
  lineas: LineaOrden[];
  total: number;
}

export interface Region {
  nombre: string;
  comunas: string[];
}

export interface EntradaBlog {
  slug: string;
  titulo: string;
  resumen: string;
  fecha: string;
  contenido: string[]; // párrafos
}

/** Resumen del dashboard administrativo (calculado por el backend con datos reales de la base de datos). */
export type PeriodoReporte = "semana" | "mes" | "anio" | "todo";

export interface ReporteResumen {
  periodo: PeriodoReporte;
  totalOperaciones: number;
  operacionesPagadas: number;
  operacionesRechazadas: number;
  operacionesCanceladas: number;
  montoTotal: number;
  unidadesVendidas: number;
  ticketPromedio: number;
  topProductos: { idProducto: string; nombre: string; unidades: number; ingresos: number }[];
  ventasPorCategoria: { categoria: string; monto: number }[];
  serie: { etiqueta: string; operaciones: number; monto: number }[];
  inventario: { totalProductos: number; stockCritico: number; enOferta: number };
  totalUsuarios: number;
}

/** Resultado estándar de las operaciones de datos: éxito/fracaso + mensaje para el usuario. */
export interface Resultado {
  ok: boolean;
  mensaje: string;
}

/** Errores de un formulario: un mensaje opcional por cada campo. */
export type Errores<T> = Partial<Record<keyof T, string>>;
