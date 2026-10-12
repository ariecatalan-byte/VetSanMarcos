import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Alerta } from "../../components/comunes/Alerta";
import { CampoInput } from "../../components/comunes/Campos";
import { useAuth } from "../../context/AuthContext";
import { puede } from "../../utils/permisos";

/**
 * Inicio de sesión. Regla heredada de EP1: la cuenta se bloquea tras 3 intentos
 * fallidos consecutivos. Una vez autenticado, se redirige al panel (admin/vendedor)
 * o a la página desde la que se pidió el login.
 */
export function Login() {
  const { usuario, iniciarSesion } = useAuth();
  const ubicacion = useLocation();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  if (usuario !== null) {
    const desde = (ubicacion.state as { desde?: string } | null)?.desde;
    return <Navigate to={desde ?? (puede(usuario.rol, "panel:acceder") ? "/admin" : "/")} replace />;
  }

  function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    const resultado = iniciarSesion(correo, password);
    if (!resultado.ok) setMensaje(resultado.mensaje);
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-5">
          <section className="mb-4 text-center">
            <span className="badge text-bg-secondary mb-3">Acceso</span>
            <h1 className="fw-bold h2">Inicia sesión</h1>
          </section>
          <section className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <form onSubmit={alEnviar} noValidate>
                <div className="mb-3"><CampoInput id="correoLogin" tipo="email" etiqueta="Correo electrónico" valor={correo} onCambio={setCorreo} /></div>
                <div className="mb-3"><CampoInput id="passwordLogin" tipo="password" etiqueta="Contraseña" valor={password} onCambio={setPassword} /></div>
                <div className="d-grid mt-4"><button type="submit" className="btn btn-primary btn-lg">Iniciar sesión</button></div>
              </form>
              {mensaje && <Alerta tipo="danger" className="mt-4 mb-0">{mensaje}</Alerta>}
              <p className="text-center mt-4 mb-0">¿Aún no tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
            </div>
          </section>
          <p className="text-secondary small text-center mt-3">
            Cuentas de prueba: admin@duoc.cl / Admin1234 · vendedor@duoc.cl / Vendedor1234 · cliente@duoc.cl / Cliente1234
          </p>
        </div>
      </div>
    </div>
  );
}
