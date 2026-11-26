# 🐾 Vet San Marcos — Frontend (Evaluación Parcial 3, DSY1104)

Tienda veterinaria en **React 19 + TypeScript + Vite + Bootstrap 5**, conectada por **API REST** al backend
Spring Boot ([`VetSanMarcos_BACKEND`](https://github.com/ariecatalan-byte/VetSanMarcos_BACKEND)).
La aplicación obtiene usuarios, productos, categorías y compras de la API REST y la base de datos del backend. No usa `localStorage`: el access token y el carrito viven en memoria; el refresh token se mantiene en una cookie `HttpOnly` del backend para restaurar la sesión.

**Equipo:** Ariel Catalán · Vinc González — Duoc UC, 2026.

## Cómo ejecutarlo

Requiere Node.js 18+ y el backend corriendo (ver su README; por defecto en `http://localhost:8080`).

```bash
npm install
cp .env.example .env     # solo si el backend NO está en http://localhost:8080/api/v1
npm run dev              # → http://localhost:5173
npm run build            # tsc + vite build
```

## Cuentas de prueba (las crea el backend al iniciar con la BD vacía)

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@duoc.cl | Admin1234 |
| Vendedor | vendedor@duoc.cl | Vendedor1234 |
| Cliente | cliente@duoc.cl | Cliente1234 |

## Qué cambió en EP3

| Tema | Implementación |
|---|---|
| React 19 | `react@19`, `@types/react@19` |
| Persistencia | Productos, categorías, usuarios y compras se consultan y modifican mediante la API (`src/api/`). El carrito es temporal y vive en memoria; no se usa `localStorage` |
| Cliente HTTP | `src/api/cliente.ts` (Axios): adjunta el JWT, renueva el access token con cookie `HttpOnly` ante un 401 y convierte errores de red/servidor en mensajes |
| Sesión | `AuthContext`: login/registro/logout contra `/auth/*`; access token en memoria y refresh token en cookie `HttpOnly`, `SameSite=Strict`. La sesión válida se restaura al recargar; el registro inicia la sesión |
| Rutas protegidas | `RutaProtegida` redirige a `/login` si no hay sesión y muestra "acceso denegado" según rol. Checkout, boletas y perfil exigen sesión |
| Permisos en la UI | `utils/permisos.ts` oculta menús y botones; **el backend vuelve a validar** cada endpoint |
| Compra | `POST /ordenes`: el servidor recalcula precios y valida stock; queda asociada al usuario autenticado |
| Historial | `Perfil` → `GET /ordenes/mis` (solo las del usuario). Admin: `GET /ordenes` y por usuario |
| Estados de orden | Admin: pagada → enviada → entregada / cancelada (devuelve stock) en la boleta |
| Reportes | `GET /reportes/resumen?periodo=semana\|mes\|anio\|todo`: tarjetas, gráfico de barras, tabla de más vendidos, ventas por categoría |
| Errores | `EstadoCarga` (spinner / error + "Reintentar"), banner global si el backend no responde, mensajes de éxito/error en cada formulario |

## Estructura

```
src/
├── main.tsx · App.tsx           Entrada, providers y mapa de rutas
├── config.ts                    URL de la API (VITE_API_URL)
├── api/                         cliente.ts (Axios + JWT) · auth · catalogo · usuarios · ordenes (+reportes)
├── types/                       Interfaces y tipos (Usuario, Producto, Orden, ReporteResumen...)
├── context/                     AuthContext (sesión) · DatosContext (catálogo) · CarritoContext
├── hooks/                       useFormulario (validación) · useCarga (peticiones a la API)
├── utils/                       permisos, validaciones, formato, filtros, estados de orden
├── components/                  comunes · layout · formularios · productos · ordenes · admin
└── pages/                       tienda/ (públicas y de cliente) · admin/ (panel)
```

## Seguridad (resumen)

- Contraseñas: nunca se guardan en el navegador; solo viajan al backend, que las almacena con BCrypt.
- El refresh token no es accesible para JavaScript (`HttpOnly`); un 401 intenta renovar la sesión activa una sola vez y, si falla, se cierra la sesión.
- `.env` está en `.gitignore`; no hay secretos en el frontend.

## Pruebas

Ver [`docs/PRUEBAS_INTEGRACION.md`](docs/PRUEBAS_INTEGRACION.md) (matriz de casos frontend ⇄ backend ⇄ BD).
