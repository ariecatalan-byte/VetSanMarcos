# Pruebas de integración — Vet San Marcos (EP3)

**Cómo ejecutarlas:** levantar backend (`mvn spring-boot:run`) y frontend (`npm run dev`); usar las cuentas de prueba del README.
Las pruebas automatizadas del backend (`mvn test`) cubren los casos marcados con 🤖 y se documentan en
`VetSanMarcos_BACKEND/docs/PRUEBAS_INTEGRACION.md`.

> Completar la columna **Resultado** (✅ / ❌) y pegar evidencia (captura o log) al ejecutar cada caso.

| # | Caso | Pasos | Resultado esperado | Resultado | Evidencia |
|---|---|---|---|---|---|
| 1 | Conexión front ⇄ back ⇄ BD | Abrir `/#/productos` con el backend encendido | El catálogo se muestra con productos de la BD | | |
| 2 | Backend apagado | Apagar backend y recargar | Banner rojo "No se pudo conectar…" con botón Reintentar | | |
| 3 | Login correcto | Entrar con `cliente@duoc.cl` / `Cliente1234` | Sesión iniciada, navbar muestra el usuario | | |
| 4 | Login incorrecto | Contraseña errónea | Mensaje "Correo o contraseña incorrectos. Intentos restantes: 2" | | |
| 5 | Bloqueo | 3 intentos fallidos | Cuenta bloqueada; el admin la desbloquea en Usuarios | | |
| 6 | Rol cliente | Ir a `/#/admin` escribiendo la URL | "Acceso denegado" | | |
| 7 | Sin sesión | Ir a `/#/perfil` sin login | Redirige a `/login` | | |
| 8 | Rol vendedor | Entrar como vendedor | Ve productos/stock; NO ve usuarios, órdenes ni reportes (ni por URL) | | |
| 9 | Rol admin | Entrar como admin | Acceso a todo el panel | | |
| 10 | CRUD productos (admin) | Crear, editar, eliminar un producto | Cambios visibles en la tienda y persisten al recargar | | |
| 11 | CRUD categorías | Crear/editar/eliminar; intentar borrar una con productos | Mensaje de error 409 al borrar con productos | | |
| 12 | CRUD usuarios | Crear, editar rol, eliminar (con y sin compras) | Con compras queda "Desactivada" | | |
| 13 | Persistencia de sesión segura | Iniciar sesión y recargar (F5) | La sesión se restaura desde cookie HttpOnly; el carrito temporal queda vacío | | |
| 14 | Cierre de sesión | Cerrar sesión | Vuelve a invitado; `/perfil` redirige a login; refresh token revocado | | |
| 15 | Expiración | Con `JWT_ACCESS_MS=20000` esperar y navegar | El token se renueva solo; con refresh vencido pide login | | |
| 16 | Compra completa | Agregar al carrito → Checkout → Pagar (aprobado) | Boleta N°, stock descontado en BD | | |
| 17 | Pago rechazado | Elegir "rechazado" | Pantalla de error; stock intacto; queda en historial | | |
| 18 | Historial | Perfil → "Mis compras" | Aparece la compra con id, fecha, estado y total | | |
| 19 | Aislamiento | Con otro cliente abrir `/#/compra/exitosa/<id ajeno>` | 403 "No puedes consultar información de otro usuario" | | |
| 20 | Estados (admin) | Boleta → Enviada → Entregada; otra → Cancelada | Estado cambia; cancelar devuelve stock | | |
| 21 | Reportes | Admin → Reportes, cambiar periodo, hacer una compra y Actualizar | Cifras coinciden con las órdenes y suben tras la compra | | |
| 22 | Swagger | `http://localhost:8080/swagger-ui.html` → Authorize → probar GET/POST/PUT/PATCH/DELETE | Operaciones CRUD responden con el código HTTP correcto | | |
