/**
 * data/seed.ts
 * -----------------------------------------------------------------------
 * Datos iniciales ("semilla") de la aplicación. Se escriben en LocalStorage
 * UNA sola vez (la primera vez que se abre la tienda). Si el usuario ya
 * creó/editó datos, no se pisan.
 *
 * Cuentas de prueba (una por rol):
 *   administrador → admin@duoc.cl     / Admin1234
 *   vendedor      → vendedor@duoc.cl  / Vendedor1234
 *   cliente       → cliente@duoc.cl   / Cliente1234
 * -----------------------------------------------------------------------
 */
import type { Categoria, Producto, Usuario } from "../types";
import { CLAVES, existe, guardar } from "./storage";

export const CATEGORIAS_INICIALES: Categoria[] = [
  { id: "Antibioticos", nombre: "Antibióticos", descripcion: "Medicamentos para tratar infecciones bacterianas en perros y gatos." },
  { id: "Antiparasitarios", nombre: "Antiparasitarios", descripcion: "Protección contra pulgas, garrapatas y parásitos." },
  { id: "Alimento", nombre: "Alimento", descripcion: "Alimento balanceado y snacks para cada etapa de vida." },
  { id: "Higiene", nombre: "Higiene", descripcion: "Shampoo y productos de limpieza para tu mascota." },
  { id: "Accesorios", nombre: "Accesorios", descripcion: "Correas, transportadoras y accesorios para el día a día." },
];

/** Catálogo basado en el de la Evaluación 1; ahora algunos productos tienen descuento (Ofertas). */
export const PRODUCTOS_INICIALES: Producto[] = [
  { id: "P001", nombre: "Amoxibay 500mg", categoriaId: "Antibioticos", especie: "Perro / Gato", precio: 4200, descuento: 0, stock: 45, stockCritico: 8, descripcion: "Antibiótico de amplio espectro en base a amoxicilina 500mg, caja de 30 cápsulas. Medicamento esencial de uso veterinario.", imagen: "img/productos/p001.png" },
  { id: "P002", nombre: "Enrox 25mg", categoriaId: "Antibioticos", especie: "Perro / Gato", precio: 6800, descuento: 0, stock: 30, stockCritico: 6, descripcion: "Antibiótico bactericida de amplio espectro en base a enrofloxacino 25mg, caja de tabletas. Indicado para infecciones bacterianas diversas.", imagen: "img/productos/p002.png" },
  { id: "P003", nombre: "Metrotab vet. 250mg", categoriaId: "Antibioticos", especie: "Perro / Gato", precio: 3900, descuento: 0, stock: 28, stockCritico: 6, descripcion: "Antiparasitario/antibiótico en base a metronidazol 250mg, comprimidos para perros y gatos (Virbac). Caja de 100 comprimidos. Uso frecuente en cuadros digestivos.", imagen: "img/productos/p003.png" },
  { id: "P004", nombre: "NexGard 68mg Comprimidos Masticables", categoriaId: "Antiparasitarios", especie: "Perro", precio: 9500, descuento: 15, stock: 60, stockCritico: 10, descripcion: "Antiparasitario masticable en base a afoxolaner 68mg, para perros de 10,1-25kg. Mata pulgas, garrapatas y ácaros. Protege durante 30 días. Caja con 3 comprimidos.", imagen: "img/productos/p004.png" },
  { id: "P005", nombre: "Bravecto 250mg Fluralaner", categoriaId: "Antiparasitarios", especie: "Perro", precio: 18900, descuento: 0, stock: 40, stockCritico: 8, descripcion: "Antiparasitario masticable de acción prolongada (12 semanas de protección) en base a fluralaner 250mg, para perros de 4,5-10kg. Contra garrapatas, pulgas y ácaros de la sarna y del oído.", imagen: "img/productos/p005.png" },
  { id: "P006", nombre: "Frontline Spray 250ml", categoriaId: "Antiparasitarios", especie: "Perro / Gato", precio: 12500, descuento: 0, stock: 15, stockCritico: 5, descripcion: "Antiparasitario en spray en base a fipronil, acción inmediata contra pulgas y garrapatas. Apto para perros y gatos desde los 2 días de nacidos. Frasco de 250ml.", imagen: "img/productos/p006.png" },
  { id: "P007", nombre: "Bravery Salmon Adulto Razas Grandes/Medianas 15kg", categoriaId: "Alimento", especie: "Perro", precio: 39990, descuento: 10, stock: 20, stockCritico: 4, descripcion: "Alimento súper premium, grain free, 100% proteína animal de salmón, sin granos. Antioxidantes naturales, hipoalergénico. Para perros adultos de razas grandes y medianas.", imagen: "img/productos/p007.png" },
  { id: "P008", nombre: "Fawna Patagonic Taste - Gato Esterilizado", categoriaId: "Alimento", especie: "Gato", precio: 27990, descuento: 0, stock: 18, stockCritico: 4, descripcion: "Alimento completo y natural con salmón del Pacífico, 38% de proteínas, prebióticos y probióticos naturales. Formulado para gatos esterilizados, ayuda a eliminar bolas de pelo.", imagen: "img/productos/p008.png" },
  { id: "P009", nombre: "Whimzees Daily Dental Treats (Toothbrush) 24un", categoriaId: "Alimento", especie: "Perro", precio: 6990, descuento: 0, stock: 50, stockCritico: 10, descripcion: "Snacks dentales 100% naturales, sin granos ni gluten. Forma de cepillo que reduce placa y sarro, refresca el aliento. Para perros de 7-12kg, bolsa de 24 unidades.", imagen: "img/productos/p009.png" },
  { id: "P010", nombre: "Skout's Honor Flea + Tick Shampoo 473ml", categoriaId: "Higiene", especie: "Perro / Gato", precio: 8990, descuento: 0, stock: 25, stockCritico: 5, descripcion: "Shampoo antipulgas y garrapatas Max Strength, aroma menta y cedro. Elimina, repele y previene. Frasco de 16 fl. oz. (473ml).", imagen: "img/productos/p010.png" },
  { id: "P011", nombre: "Correa Retráctil para Perro", categoriaId: "Accesorios", especie: "Perro", precio: 7990, descuento: 20, stock: 12, stockCritico: 3, descripcion: "Correa retráctil resistente con mango ergonómico antideslizante, ideal para paseos diarios. Disponible en varios colores.", imagen: "img/productos/p011.png" },
  { id: "P012", nombre: "Transportadora Grande para Viajes", categoriaId: "Accesorios", especie: "Perro / Gato", precio: 24990, descuento: 0, stock: 5, stockCritico: 5, descripcion: "Transportadora rígida ventilada con puerta de rejilla metálica, apta para viajes en auto o avión y visitas a la clínica veterinaria.", imagen: "img/productos/p012.png" },
];

export const USUARIOS_INICIALES: Usuario[] = [
  { id: "U001", nombre: "Admin", apellido: "San Marcos", fechaNacimiento: "1990-05-10", genero: "Prefiero no decirlo", correo: "admin@duoc.cl", password: "Admin1234", direccion: "Av. Principal 123", region: "Región Metropolitana de Santiago", comuna: "Santiago", rol: "administrador" },
  { id: "U002", nombre: "Valentina", apellido: "Rojas", fechaNacimiento: "1995-08-21", genero: "Femenino", correo: "vendedor@duoc.cl", password: "Vendedor1234", direccion: "Calle Los Alerces 456", region: "Región Metropolitana de Santiago", comuna: "Providencia", rol: "vendedor" },
  { id: "U003", nombre: "Matías", apellido: "Soto", fechaNacimiento: "2001-03-14", genero: "Masculino", correo: "cliente@duoc.cl", password: "Cliente1234", direccion: "Pasaje Las Rosas 789", region: "Región Metropolitana de Santiago", comuna: "Puente Alto", rol: "cliente" },
];

/** Escribe los datos iniciales solo si todavía no existen en LocalStorage. */
export function inicializarDatos(): void {
  if (!existe(CLAVES.categorias)) guardar(CLAVES.categorias, CATEGORIAS_INICIALES);
  if (!existe(CLAVES.productos)) guardar(CLAVES.productos, PRODUCTOS_INICIALES);
  if (!existe(CLAVES.usuarios)) guardar(CLAVES.usuarios, USUARIOS_INICIALES);
  if (!existe(CLAVES.ordenes)) guardar(CLAVES.ordenes, []);
}
