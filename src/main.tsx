/**
 * main.tsx — punto de entrada de la aplicación.
 * 1) Carga Bootstrap 5 (CSS) y los estilos propios.
 * 2) Escribe los datos iniciales en LocalStorage si es la primera vez.
 * 3) Monta la app con sus tres contextos: usuarios/sesión → datos de la tienda → carrito.
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
import { inicializarDatos } from "./data/seed";

inicializarDatos();

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
