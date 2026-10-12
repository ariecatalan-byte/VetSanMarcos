# 🐾 Vet San Marcos — Evaluación Parcial 2 (DSY1104)

Tienda online veterinaria **migrada de HTML/CSS/JS (EP1) a React + TypeScript + Vite + Bootstrap 5**, ampliada con
roles de usuario (administrador, vendedor, cliente), panel de gestión, perfil personal, checkout con boleta y reportes.
Proyecto 100 % frontend: la persistencia se simula con **LocalStorage** (no es un sistema de seguridad de producción).

**Equipo:** Ariel Catalán · Vinc González — Duoc UC, 2026.

## Cómo ejecutarlo

Requiere Node.js 18 o superior.

```bash
npm install
npm run dev        # desarrollo → http://localhost:5173
npm run build      # compila TypeScript y genera /dist
npm run preview    # sirve /dist
```

La app usa rutas con `#` (HashRouter), por lo que `dist/` funciona en cualquier hosting estático (p. ej. GitHub Pages).

## Cuentas de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@duoc.cl | Admin1234 |
| Vendedor | vendedor@duoc.cl | Vendedor1234 |
| Cliente | cliente@duoc.cl | Cliente1234 |

Para volver a los datos iniciales: DevTools → Application → Local Storage → borrar las claves `vsm_v2_*`.

## Roles y permisos (`src/utils/permisos.ts`)

| Operación | Administrador | Vendedor | Cliente |
|---|:-:|:-:|:-:|
| Navegar, comprar, editar su perfil | ✅ | ✅ | ✅ |
| Panel de gestión | ✅ | ✅ | ❌ |
| Consultar productos / modificar stock | ✅ | ✅ | ❌ |
| Crear / editar / eliminar productos | ✅ | ❌ | ❌ |
| CRUD de categorías | ✅ | ❌ | ❌ |
| CRUD de usuarios y asignar roles | ✅ | ❌ | ❌ |
| Crear usuarios | cualquier rol | solo **cliente** | ❌ |
| Órdenes/boletas y reportes | ✅ | ❌ | ❌ |

El registro público siempre crea **clientes**. Nadie puede cambiar su propio rol. La matriz se aplica en tres niveles:
menú (qué se muestra), rutas (`RutaProtegida`) y contextos (rechazan la operación aunque la UI se manipule).

## Estructura

```
src/
├── main.tsx · App.tsx           Entrada, providers y mapa de rutas
├── types/                       Interfaces y tipos (Usuario, Producto, Orden, Rol...)
├── data/                        "Archivo de datos": CRUD sobre LocalStorage
│   ├── storage.ts · seed.ts     Acceso genérico + datos iniciales
│   └── productosRepo · categoriasRepo · usuariosRepo · ordenesRepo · carritoRepo
├── context/                     Estado global: AuthContext, DatosContext, CarritoContext
├── hooks/useFormulario.ts       Inputs controlados + validación en tiempo real
├── utils/                       permisos, validaciones, formato, filtros
├── components/
│   ├── comunes/                 Campos de formulario, Alerta, Avatar, Insignias...
│   ├── layout/                  Navbar, Footer, LayoutTienda, LayoutAdmin, RutaProtegida
│   ├── productos/ carrito/ ordenes/ admin/ secciones/
│   └── formularios/             FormUsuario (4 modos), FormProducto, FormCategoria, FormContacto
└── pages/
    ├── tienda/                  Home, Productos, Detalle, Categorías, Ofertas, Blog, Carrito,
    │                            Checkout, Compra exitosa / Pago con error, Login, Registro, Perfil
    └── admin/                   Dashboard, Órdenes, Productos, Críticos, Categorías, Usuarios, Reportes
```

## Reglas de negocio heredadas de EP1 (se conservan)

- Registro: edad mínima 14 años, correo `@duoc.cl`, contraseña ≥ 8 con letras y números, región/comuna dinámicas, condiciones.
- Login: bloqueo de la cuenta tras 3 intentos fallidos (el administrador puede desbloquear).
- Catálogo: filtros combinables (categoría, precio máximo, búsqueda) sin recargar.
- Carrito: no duplica productos, no supera el stock, descuenta stock al comprar.
- Contacto: validaciones de nombre, correo (dominios permitidos) y mensaje.

## Novedades de EP2

Categorías y Ofertas · Checkout (datos + dirección) · Compra exitosa / Pago con error con boleta imprimible ·
Detalle de producto con descuento · Blog · Panel con dashboard, órdenes, productos críticos, usuarios, historial de compras y reportes ·
Perfil con avatar, edad derivada y mis compras.

> El pago es una **simulación**: en el checkout se elige si resulta aprobado o rechazado para demostrar ambos flujos.
> Las pruebas automatizadas no se incluyen porque el instrumento de evaluación del curso indica que no se solicitan.
