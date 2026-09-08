/**
 * storage.js
 * -----------------------------------------------------------------------
 * Capa de persistencia de Vet San Marcos usando LocalStorage.
 * Aquí NO se usa base de datos (según instrucciones EP1 DSY1104): toda la
 * información necesaria para el funcionamiento de la tienda (productos,
 * usuarios, sesión, carrito e intentos de login) se administra mediante
 * el objeto window.localStorage.
 *
 * Este archivo debe cargarse ANTES que cualquier otro script de página
 * (catalogo.js, detalle.js, registro.js, login.js, carrito.js, contacto.js)
 * porque expone funciones globales que ellos utilizan.
 * -----------------------------------------------------------------------
 */

/* ============================ CLAVES ================================ */
const CLAVE_PRODUCTOS = "vetcare_productos";
const CLAVE_USUARIOS = "vetcare_usuarios";
const CLAVE_SESION = "vetcare_sesion";
const CLAVE_CARRITO = "vetcare_carrito";
const CLAVE_INTENTOS = "vetcare_intentos_login";
const MAX_INTENTOS_FALLIDOS = 3;

/* ====================== CATÁLOGO INICIAL (SEED) ======================
 * Basado en el catálogo de referencia "Veterinaria San Marcos" (Forma A).
 * Se guarda una sola vez: si el usuario ya agregó/editó productos desde
 * el navegador, no se pisan sus datos en visitas posteriores.
 * ===================================================================== */
const PRODUCTOS_INICIALES = [
    { id: "P001", nombre: "Amoxibay 250mg", categoria: "Antibioticos", especie: "Perro / Gato", precio: 4200, stock: 45, stockCritico: 8, descripcion: "Antibiótico de amplio espectro en base a amoxicilina, blíster de 10 comprimidos. Uso exclusivo bajo indicación veterinaria.", imagen: "img/productos/p001.svg" },
    { id: "P002", nombre: "Enrox 50mg", categoria: "Antibioticos", especie: "Perro / Gato", precio: 6800, stock: 30, stockCritico: 6, descripcion: "Antibiótico en base a enrofloxacino, blíster de 10 comprimidos. Indicado para infecciones bacterianas diversas.", imagen: "img/productos/p002.svg" },
    { id: "P003", nombre: "Metrobay 250mg", categoria: "Antibioticos", especie: "Perro / Gato", precio: 3900, stock: 28, stockCritico: 6, descripcion: "Antibiótico en base a metronidazol, blíster de 10 comprimidos. Uso frecuente en cuadros digestivos.", imagen: "img/productos/p003.svg" },
    { id: "P004", nombre: "Nexgard Masticable", categoria: "Antiparasitarios", especie: "Perro", precio: 9500, stock: 60, stockCritico: 10, descripcion: "Antiparasitario externo masticable en base a afoxolaner. Protección mensual contra pulgas y garrapatas.", imagen: "img/productos/p004.svg" },
    { id: "P005", nombre: "Bravecto Masticable", categoria: "Antiparasitarios", especie: "Perro", precio: 18900, stock: 40, stockCritico: 8, descripcion: "Antiparasitario externo de acción prolongada (hasta 12 semanas) en base a fluralaner.", imagen: "img/productos/p005.svg" },
    { id: "P006", nombre: "Frontline Spray 250ml", categoria: "Antiparasitarios", especie: "Perro / Gato", precio: 12500, stock: 15, stockCritico: 5, descripcion: "Antiparasitario externo en spray, apto para perros y gatos desde los 2 días de nacidos.", imagen: "img/productos/p006.svg" },
    { id: "P007", nombre: "Alimento Premium Perro Adulto 15kg", categoria: "Alimento", especie: "Perro", precio: 39990, stock: 20, stockCritico: 4, descripcion: "Alimento balanceado premium para perros adultos de todas las razas, con proteína de alta calidad.", imagen: "img/productos/p007.svg" },
    { id: "P008", nombre: "Alimento Gato Esterilizado 7.5kg", categoria: "Alimento", especie: "Gato", precio: 27990, stock: 18, stockCritico: 4, descripcion: "Alimento balanceado formulado para gatos esterilizados, control de peso y bola de pelo.", imagen: "img/productos/p008.svg" },
    { id: "P009", nombre: "Snacks Dentales Perro", categoria: "Alimento", especie: "Perro", precio: 6990, stock: 50, stockCritico: 10, descripcion: "Snacks dentales que ayudan a reducir el sarro y refrescar el aliento.", imagen: "img/productos/p009.svg" },
    { id: "P010", nombre: "Shampoo Antipulgas 300ml", categoria: "Higiene", especie: "Perro / Gato", precio: 8990, stock: 25, stockCritico: 5, descripcion: "Shampoo formulado para eliminar pulgas y garrapatas, apto para uso frecuente.", imagen: "img/productos/p010.svg" },
    { id: "P011", nombre: "Correa Ajustable 1.5m", categoria: "Accesorios", especie: "Perro", precio: 7990, stock: 12, stockCritico: 3, descripcion: "Correa de nylon resistente, ajustable, ideal para paseos diarios.", imagen: "img/productos/p011.svg" },
    { id: "P012", nombre: "Transportadora Mediana", categoria: "Accesorios", especie: "Perro / Gato", precio: 24990, stock: 5, stockCritico: 2, descripcion: "Transportadora rígida ventilada, apta para viajes y visitas a la clínica veterinaria.", imagen: "img/productos/p012.svg" }
];

const NOMBRES_CATEGORIAS = {
    Antibioticos: "Antibióticos",
    Antiparasitarios: "Antiparasitarios",
    Alimento: "Alimento",
    Higiene: "Higiene",
    Accesorios: "Accesorios"
};

/* ============================ PRODUCTOS =============================== */
function inicializarProductos() {
    if (localStorage.getItem(CLAVE_PRODUCTOS) === null) {
        localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(PRODUCTOS_INICIALES));
    }
}

function obtenerProductos() {
    inicializarProductos();
    return JSON.parse(localStorage.getItem(CLAVE_PRODUCTOS));
}

function guardarProductos(productos) {
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
}

function obtenerProductoPorId(id) {
    return obtenerProductos().find(function (p) { return p.id === id; }) || null;
}

/** Descuenta stock de un producto. Retorna true si pudo descontar. */
function descontarStock(id, cantidad) {
    const productos = obtenerProductos();
    const producto = productos.find(function (p) { return p.id === id; });
    if (!producto || producto.stock < cantidad) return false;
    producto.stock -= cantidad;
    guardarProductos(productos);
    return true;
}

/* ============================= USUARIOS ================================ */
function obtenerUsuarios() {
    const datos = localStorage.getItem(CLAVE_USUARIOS);
    return datos === null ? [] : JSON.parse(datos);
}

function guardarUsuarios(usuarios) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function obtenerUsuarioPorCorreo(correo) {
    return obtenerUsuarios().find(function (u) {
        return u.correo.toLowerCase() === correo.toLowerCase();
    }) || null;
}

function registrarUsuario(usuario) {
    const usuarios = obtenerUsuarios();
    usuarios.push(usuario);
    guardarUsuarios(usuarios);
}

/* ============================== SESIÓN ================================= */
function iniciarSesion(correo) {
    localStorage.setItem(CLAVE_SESION, correo);
}

function cerrarSesion() {
    localStorage.removeItem(CLAVE_SESION);
}

function obtenerSesion() {
    return localStorage.getItem(CLAVE_SESION);
}

function usuarioAutenticado() {
    const correo = obtenerSesion();
    if (!correo) return null;
    return obtenerUsuarioPorCorreo(correo);
}

/* ==================== CONTROL DE INTENTOS DE LOGIN ====================== */
function obtenerIntentos() {
    const datos = localStorage.getItem(CLAVE_INTENTOS);
    return datos === null ? {} : JSON.parse(datos);
}

function guardarIntentos(intentos) {
    localStorage.setItem(CLAVE_INTENTOS, JSON.stringify(intentos));
}

function registrarIntentoFallido(correo) {
    const intentos = obtenerIntentos();
    const clave = correo.toLowerCase();
    if (!intentos[clave]) intentos[clave] = { fallidos: 0, bloqueado: false };
    intentos[clave].fallidos += 1;
    if (intentos[clave].fallidos >= MAX_INTENTOS_FALLIDOS) {
        intentos[clave].bloqueado = true;
    }
    guardarIntentos(intentos);
    return intentos[clave];
}

function reiniciarIntentos(correo) {
    const intentos = obtenerIntentos();
    delete intentos[correo.toLowerCase()];
    guardarIntentos(intentos);
}

function cuentaBloqueada(correo) {
    const intentos = obtenerIntentos();
    const registro = intentos[correo.toLowerCase()];
    return !!(registro && registro.bloqueado);
}

/* =============================== CARRITO ================================ */
function obtenerCarrito() {
    const datos = localStorage.getItem(CLAVE_CARRITO);
    return datos === null ? [] : JSON.parse(datos);
}

function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

/** Agrega un producto al carrito. Si ya existe, actualiza la cantidad (no duplica). */
function agregarAlCarrito(idProducto, cantidad) {
    const producto = obtenerProductoPorId(idProducto);
    if (!producto) return { ok: false, mensaje: "El producto no existe." };

    const carrito = obtenerCarrito();
    const item = carrito.find(function (i) { return i.idProducto === idProducto; });
    const cantidadActual = item ? item.cantidad : 0;
    const cantidadTotal = cantidadActual + cantidad;

    if (cantidadTotal > producto.stock) {
        return { ok: false, mensaje: "No hay stock suficiente. Disponible: " + producto.stock + " unidad(es)." };
    }

    if (item) {
        item.cantidad = cantidadTotal;
    } else {
        carrito.push({ idProducto: idProducto, cantidad: cantidad });
    }
    guardarCarrito(carrito);
    return { ok: true, mensaje: "Producto agregado al carrito." };
}

function eliminarDelCarrito(idProducto) {
    const carrito = obtenerCarrito().filter(function (i) { return i.idProducto !== idProducto; });
    guardarCarrito(carrito);
}

function vaciarCarrito() {
    localStorage.removeItem(CLAVE_CARRITO);
}

function contarItemsCarrito() {
    return obtenerCarrito().reduce(function (total, i) { return total + i.cantidad; }, 0);
}

function calcularTotalCarrito() {
    return obtenerCarrito().reduce(function (total, i) {
        const producto = obtenerProductoPorId(i.idProducto);
        return producto ? total + producto.precio * i.cantidad : total;
    }, 0);
}

/* ============================ UTILIDADES ================================ */
function formatearCLP(valor) {
    return valor.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

/** Actualiza el contador del carrito en el header (si el elemento existe en la página). */
function actualizarBadgeCarrito() {
    const badge = document.getElementById("contadorCarrito");
    if (badge) badge.textContent = contarItemsCarrito();
}

/** Muestra en el nav si hay un usuario logueado, y cambia el enlace de "Ingresar" por su nombre. */
function actualizarEstadoSesionNav() {
    const zonaSesion = document.getElementById("zonaSesion");
    if (!zonaSesion) return;
    const usuario = usuarioAutenticado();
    if (usuario) {
        zonaSesion.innerHTML =
            '<span class="nav-link disabled">Hola, ' + usuario.nombre + '</span>' +
            '<a class="nav-link" href="#" id="btnCerrarSesion">Cerrar sesión</a>';
        const btn = document.getElementById("btnCerrarSesion");
        if (btn) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                cerrarSesion();
                window.location.href = "index.html";
            });
        }
    } else {
        zonaSesion.innerHTML = '<a class="nav-link" href="login.html">Ingresar</a>';
    }
}

document.addEventListener("DOMContentLoaded", function () {
    inicializarProductos();
    actualizarBadgeCarrito();
    actualizarEstadoSesionNav();
});
