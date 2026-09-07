/**
 * registro.js
 * Validaciones en tiempo real y al enviar el formulario de registro,
 * de acuerdo a las reglas de negocio definidas en la EP1:
 *  - Edad mínima: 14 años
 *  - Dominio de correo autorizado: @duoc.cl
 *  - Campos obligatorios
 *  - Selección válida de región / comuna
 *  - Selección de género
 *  - Aceptación de condiciones de registro
 *  - Requisitos de seguridad y formato de contraseña
 */
document.addEventListener("DOMContentLoaded", function () {
    const EDAD_MINIMA = 14;
    const DOMINIO_PERMITIDO = "@duoc.cl";

    const formulario = document.getElementById("formRegistro");
    const selectRegion = document.getElementById("region");
    const selectComuna = document.getElementById("comuna");

    poblarSelectRegiones(selectRegion);
    selectRegion.addEventListener("change", function () {
        poblarSelectComunas(selectRegion, selectComuna);
    });

    function mostrarError(idCampo, mensaje) {
        const campo = document.getElementById(idCampo);
        const error = document.getElementById("error" + idCampo.charAt(0).toUpperCase() + idCampo.slice(1));
        campo.classList.add("is-invalid");
        if (error) {
            error.textContent = mensaje;
            error.classList.remove("d-none");
        }
    }

    function limpiarError(idCampo) {
        const campo = document.getElementById(idCampo);
        const error = document.getElementById("error" + idCampo.charAt(0).toUpperCase() + idCampo.slice(1));
        campo.classList.remove("is-invalid");
        if (error) error.classList.add("d-none");
    }

    function calcularEdad(fechaNacimientoStr) {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimientoStr);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
        return edad;
    }

    function validarFormulario() {
        let esValido = true;
        ["nombre", "apellido", "fechaNacimiento", "genero", "correo", "password",
         "confirmarPassword", "direccion", "region", "comuna", "condiciones"].forEach(limpiarError);

        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const fechaNacimiento = document.getElementById("fechaNacimiento").value;
        const genero = document.getElementById("genero").value;
        const correo = document.getElementById("correo").value.trim();
        const password = document.getElementById("password").value;
        const confirmarPassword = document.getElementById("confirmarPassword").value;
        const direccion = document.getElementById("direccion").value.trim();
        const region = document.getElementById("region").value;
        const comuna = document.getElementById("comuna").value;
        const aceptaCondiciones = document.getElementById("aceptaCondiciones").checked;

        if (nombre === "" || nombre.length > 50) {
            mostrarError("nombre", "El nombre es obligatorio (máximo 50 caracteres).");
            esValido = false;
        }
        if (apellido === "" || apellido.length > 100) {
            mostrarError("apellido", "El apellido es obligatorio (máximo 100 caracteres).");
            esValido = false;
        }
        if (fechaNacimiento === "") {
            mostrarError("fechaNacimiento", "Debes indicar tu fecha de nacimiento.");
            esValido = false;
        } else if (calcularEdad(fechaNacimiento) < EDAD_MINIMA) {
            mostrarError("fechaNacimiento", "Debes tener al menos " + EDAD_MINIMA + " años para registrarte.");
            esValido = false;
        }
        if (genero === "") {
            mostrarError("genero", "Selecciona una opción de género.");
            esValido = false;
        }
        if (correo === "") {
            mostrarError("correo", "El correo es obligatorio.");
            esValido = false;
        } else if (correo.length > 100) {
            mostrarError("correo", "El correo no puede superar los 100 caracteres.");
            esValido = false;
        } else if (!correo.toLowerCase().endsWith(DOMINIO_PERMITIDO)) {
            mostrarError("correo", "Solo se aceptan correos institucionales " + DOMINIO_PERMITIDO);
            esValido = false;
        } else if (obtenerUsuarioPorCorreo(correo)) {
            mostrarError("correo", "Ya existe una cuenta registrada con este correo.");
            esValido = false;
        }

        const regexPassword = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!regexPassword.test(password)) {
            mostrarError("password", "La contraseña debe tener mínimo 8 caracteres, con letras y números.");
            esValido = false;
        }
        if (confirmarPassword !== password || confirmarPassword === "") {
            mostrarError("confirmarPassword", "Las contraseñas no coinciden.");
            esValido = false;
        }

        if (direccion === "" || direccion.length > 300) {
            mostrarError("direccion", "La dirección es obligatoria (máximo 300 caracteres).");
            esValido = false;
        }
        if (region === "") {
            mostrarError("region", "Selecciona una región.");
            esValido = false;
        }
        if (comuna === "") {
            mostrarError("comuna", "Selecciona una comuna.");
            esValido = false;
        }
        if (!aceptaCondiciones) {
            mostrarError("condiciones", "Debes aceptar las condiciones de registro.");
            esValido = false;
        }

        return esValido;
    }

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        const mensajeOk = document.getElementById("mensajeRegistro");
        const mensajeError = document.getElementById("mensajeErrorRegistro");
        mensajeOk.classList.add("d-none");
        mensajeError.classList.add("d-none");

        if (!validarFormulario()) {
            mensajeError.textContent = "Revisa los campos marcados en rojo antes de continuar.";
            mensajeError.classList.remove("d-none");
            return;
        }

        const nuevoUsuario = {
            nombre: document.getElementById("nombre").value.trim(),
            apellido: document.getElementById("apellido").value.trim(),
            fechaNacimiento: document.getElementById("fechaNacimiento").value,
            genero: document.getElementById("genero").value,
            correo: document.getElementById("correo").value.trim(),
            password: document.getElementById("password").value,
            direccion: document.getElementById("direccion").value.trim(),
            region: document.getElementById("region").value,
            comuna: document.getElementById("comuna").value
        };

        registrarUsuario(nuevoUsuario);
        formulario.reset();
        selectComuna.innerHTML = '<option value="" selected disabled>-- Seleccione la comuna --</option>';

        mensajeOk.textContent = "¡Cuenta creada con éxito! Ya puedes iniciar sesión.";
        mensajeOk.classList.remove("d-none");
        setTimeout(function () { window.location.href = "login.html"; }, 1500);
    });
});
