# 🐾 Vet San Marcos

Tienda online de productos veterinarios (medicamentos, antiparasitarios, alimento, higiene y accesorios), desarrollada como Evaluación Parcial 1 de la asignatura **DSY1104 – Desarrollo FullStack II** (Duoc UC).

Proyecto 100% frontend (HTML, CSS y JavaScript), sin backend ni base de datos: toda la información (catálogo, usuarios, sesión y carrito) se administra con **LocalStorage**.

## Equipo

- Ariel Catalán
- Vinc González

## Funcionalidades

- **Página principal**: menú de navegación, productos destacados, video de tips de cuidado, sección "Quiénes somos" y "Contáctanos" (mapa + formulario).
- **Catálogo**: 12 productos con filtros combinables por categoría, precio máximo y búsqueda por nombre, sin recargar la página.
- **Detalle de producto**: ficha completa con control de stock disponible.
- **Registro de usuarios**: validaciones de edad mínima (14 años), dominio de correo institucional (`@duoc.cl`), formato de contraseña, región/comuna dinámicas y aceptación de condiciones.
- **Inicio de sesión**: bloqueo de cuenta tras 3 intentos fallidos consecutivos.
- **Carrito de compras**: agregar, modificar cantidad, eliminar, vaciar y finalizar compra, con descuento real de stock al comprar.

## Tecnologías

- HTML5 semántico
- CSS3 (hoja de estilos externa personalizada) + Bootstrap 5.3.8 (CDN)
- JavaScript (ES6, sin frameworks)
- LocalStorage como capa de persistencia

## Estructura del proyecto

```
├── index.html          # Página principal
├── catalogo.html        # Catálogo de productos
├── detalle.html          # Detalle de un producto
├── registro.html         # Registro de usuarios
├── login.html            # Inicio de sesión
├── carrito.html           # Carrito de compras
├── css/
│   └── style.css          # Estilos personalizados
├── js/
│   ├── storage.js          # Capa de datos (productos, usuarios, sesión, carrito)
│   ├── regiones.js           # Regiones y comunas de Chile
│   ├── index.js               # Lógica de la página principal
│   ├── catalogo.js             # Filtros del catálogo
│   ├── detalle.js               # Lógica del detalle de producto
│   ├── registro.js               # Validaciones del registro
│   ├── login.js                   # Validaciones del login
│   ├── carrito.js                  # Lógica del carrito
│   └── contacto.js                  # Validación del formulario de contacto
└── img/productos/           # Imágenes de los productos
```

## Cómo ejecutar el proyecto

No requiere instalación. Basta con abrir `index.html` en un navegador, o servirlo con un servidor local simple, por ejemplo:

```bash
python3 -m http.server 8000
```

y luego visitar `http://localhost:8000`.

## Alcance de esta etapa (EP1)

- ✅ Frontend completo con HTML, CSS y JavaScript.
- ✅ Persistencia con LocalStorage (sin base de datos).
- 🔜 En próximas etapas del curso: backend con microservicios, base de datos, panel administrador y pasarela de pago real.

## Asignatura

DSY1104 – Desarrollo FullStack II — Evaluación Parcial 1 (30%) — Duoc UC, 2026.
