/**
 * contacto.js
 * Validaciones del formulario de contacto ubicado en index.html.
 * Reglas: nombre requerido (max 100), correo opcional pero validado si
 * se ingresa (max 100, dominio institucional o gmail), mensaje
 * requerido (max 500).
 */
document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formContacto");
    if (!formulario) return;

    const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        let esValido = true;
        const nombre = document.getElementById("nombreContacto").value.trim();
        const correo = document.getElementById("correoContacto").value.trim();
        const mensaje = document.getElementById("mensajeContacto").value.trim();

        const errorNombre = document.getElementById("errorNombreContacto");
        const errorCorreo = document.getElementById("errorCorreoContacto");
        const errorMensaje = document.getElementById("errorMensajeContacto");
        [errorNombre, errorCorreo, errorMensaje].forEach(function (e) { e.classList.add("d-none"); });

        if (nombre === "" || nombre.length > 100) {
            errorNombre.textContent = "El nombre es obligatorio (máximo 100 caracteres).";
            errorNombre.classList.remove("d-none");
            esValido = false;
        }

        if (correo !== "") {
            const dominioValido = DOMINIOS_PERMITIDOS.some(function (d) { return correo.toLowerCase().endsWith(d); });
            if (correo.length > 100 || !dominioValido) {
                errorCorreo.textContent = "Ingresa un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).";
                errorCorreo.classList.remove("d-none");
                esValido = false;
            }
        }

        if (mensaje === "" || mensaje.length > 500) {
            errorMensaje.textContent = "El mensaje es obligatorio (máximo 500 caracteres).";
            errorMensaje.classList.remove("d-none");
            esValido = false;
        }

        if (!esValido) return;

        formulario.reset();
        const ok = document.getElementById("mensajeContactoOk");
        ok.classList.remove("d-none");
        setTimeout(function () { ok.classList.add("d-none"); }, 4000);
    });
});
