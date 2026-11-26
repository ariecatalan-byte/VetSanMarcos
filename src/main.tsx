/**
 * main.tsx — punto de entrada de la aplicación.
 * 1) Carga Bootstrap 5 (CSS) y los estilos propios.
 * 2) Monta la app con sus tres contextos: sesión (JWT) → catálogo (API REST) → carrito.
 *    Todos los datos de negocio vienen del backend Spring Boot / base de datos.
 *    Se usa HashRouter (#/ruta) para que funcione en cualquier hosting estático.
 */
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/app.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CarritoProvider } from "./context/CarritoContext";
import { DatosProvider } from "./context/DatosContext";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <DatosProvider>
          <CarritoProvider>
            <App />
          </CarritoProvider>
        </DatosProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
);
