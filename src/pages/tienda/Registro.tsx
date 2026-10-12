import { Link, useNavigate } from "react-router-dom";
import { FormUsuario } from "../../components/formularios/FormUsuario";
import { useAuth } from "../../context/AuthContext";
import { aNuevoUsuario } from "../../utils/usuarios";

/** Registro público: crea EXCLUSIVAMENTE cuentas de cliente (el rol no se puede elegir). */
export function Registro() {
  const { usuarios, registrarCliente } = useAuth();
  const navegar = useNavigate();
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <section className="mb-4 text-center">
            <span className="badge text-bg-secondary mb-3">Crear cuenta</span>
            <h1 className="fw-bold h2">Regístrate en Vet San Marcos</h1>
            <p className="text-secondary">Solo se aceptan correos institucionales @duoc.cl.</p>
          </section>
          <section className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <FormUsuario modo="registro" usuarios={usuarios} textoBoton="Crear cuenta"
                onGuardar={(datos) => registrarCliente(aNuevoUsuario(datos))}
                onExito={() => setTimeout(() => navegar("/login"), 1500)} />
              <p className="text-center mt-3 mb-0">¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
