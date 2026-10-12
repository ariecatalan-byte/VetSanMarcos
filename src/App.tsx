/**
 * App.tsx — mapa de rutas de toda la aplicación (React Router).
 *  - Tienda pública (LayoutTienda): inicio, productos, categorías, ofertas, nosotros,
 *    blog, contacto, carrito, checkout, resultado de compra, login, registro y perfil.
 *  - Panel de gestión (/admin, LayoutAdmin): solo administrador y vendedor; cada
 *    página exige además un permiso específico (utils/permisos.ts).
 */
import type { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import { LayoutAdmin } from "./components/layout/LayoutAdmin";
import { LayoutTienda } from "./components/layout/LayoutTienda";
import { RutaProtegida } from "./components/layout/RutaProtegida";
import type { Accion } from "./utils/permisos";

import { BoletaAdmin } from "./pages/admin/BoletaAdmin";
import { CategoriasAdmin } from "./pages/admin/CategoriasAdmin";
import { Dashboard } from "./pages/admin/Dashboard";
import { HistorialUsuario } from "./pages/admin/HistorialUsuario";
import { OrdenesAdmin } from "./pages/admin/OrdenesAdmin";
import { ProductoFormulario } from "./pages/admin/ProductoFormulario";
import { ProductosAdmin } from "./pages/admin/ProductosAdmin";
import { ProductosCriticos } from "./pages/admin/ProductosCriticos";
import { Reportes } from "./pages/admin/Reportes";
import { UsuarioFormulario } from "./pages/admin/UsuarioFormulario";
import { UsuariosAdmin } from "./pages/admin/UsuariosAdmin";

import { Blog } from "./pages/tienda/Blog";
import { BlogDetalle } from "./pages/tienda/BlogDetalle";
import { Carrito } from "./pages/tienda/Carrito";
import { CategoriaDetalle } from "./pages/tienda/CategoriaDetalle";
import { Categorias } from "./pages/tienda/Categorias";
import { Checkout } from "./pages/tienda/Checkout";
import { CompraExitosa } from "./pages/tienda/CompraExitosa";
import { Contacto } from "./pages/tienda/Contacto";
import { Home } from "./pages/tienda/Home";
import { Login } from "./pages/tienda/Login";
import { NoEncontrada } from "./pages/tienda/NoEncontrada";
import { Nosotros } from "./pages/tienda/Nosotros";
import { Ofertas } from "./pages/tienda/Ofertas";
import { PagoError } from "./pages/tienda/PagoError";
import { Perfil } from "./pages/tienda/Perfil";
import { ProductoDetalle } from "./pages/tienda/ProductoDetalle";
import { Productos } from "./pages/tienda/Productos";
import { Registro } from "./pages/tienda/Registro";

/** Envuelve una página del panel con la exigencia de un permiso. */
const conPermiso = (permiso: Accion, pagina: ReactElement) => <RutaProtegida permiso={permiso}>{pagina}</RutaProtegida>;

export default function App() {
  return (
    <Routes>
      <Route element={<LayoutTienda />}>
        <Route index element={<Home />} />
        <Route path="productos" element={<Productos />} />
        <Route path="productos/:id" element={<ProductoDetalle />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="categorias/:id" element={<CategoriaDetalle />} />
        <Route path="ofertas" element={<Ofertas />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogDetalle />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="compra/exitosa/:id" element={<CompraExitosa />} />
        <Route path="compra/error/:id" element={<PagoError />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="perfil" element={<RutaProtegida><Perfil /></RutaProtegida>} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>

      <Route path="admin" element={<RutaProtegida permiso="panel:acceder"><LayoutAdmin /></RutaProtegida>}>
        <Route index element={<Dashboard />} />
        <Route path="ordenes" element={conPermiso("ordenes:ver", <OrdenesAdmin />)} />
        <Route path="ordenes/:id" element={conPermiso("ordenes:ver", <BoletaAdmin />)} />
        <Route path="productos" element={conPermiso("productos:ver", <ProductosAdmin />)} />
        <Route path="productos/criticos" element={conPermiso("productos:ver", <ProductosCriticos />)} />
        <Route path="productos/nuevo" element={conPermiso("productos:crear", <ProductoFormulario />)} />
        <Route path="productos/:id/editar" element={conPermiso("productos:editar", <ProductoFormulario />)} />
        <Route path="categorias" element={conPermiso("categorias:gestionar", <CategoriasAdmin />)} />
        <Route path="usuarios" element={conPermiso("usuarios:listar", <UsuariosAdmin />)} />
        <Route path="usuarios/nuevo" element={conPermiso("usuarios:crear", <UsuarioFormulario />)} />
        <Route path="usuarios/:id/editar" element={conPermiso("usuarios:editar", <UsuarioFormulario />)} />
        <Route path="usuarios/:id/historial" element={conPermiso("usuarios:listar", <HistorialUsuario />)} />
        <Route path="reportes" element={conPermiso("reportes:ver", <Reportes />)} />
      </Route>
    </Routes>
  );
}
