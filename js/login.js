/**
 * login.js
 * Valida las credenciales contra los usuarios almacenados en LocalStorage.
 * Regla de negocio: la cuenta se bloquea tras 3 intentos fallidos
 * consecutivos (MAX_INTENTOS_FALLIDOS, definido en storage.js).
 */
document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formLogin");
    const mensajeLogin = document.getElementById("mensajeLogin");

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        mensajeLogin.classList.add("d-none");

        document.getElementById("correoLogin").classList.remove("is-invalid");
        document.getElementById("passwordLogin").classList.remove("is-invalid");
        document.getElementById("errorCorreoLogin").classList.add("d-none");
        document.getElementById("errorPasswordLogin").classList.add("d-none");

        const correo = document.getElementById("correoLogin").value.trim();
        const password = document.getElementById("passwordLogin").value;

        if (correo === "" || password === "") {
            mensajeLogin.textContent = "Ingresa tu correo y contraseña.";
            mensajeLogin.classList.remove("d-none");
            return;
        }

        if (cuentaBloqueada(correo)) {
            mensajeLogin.textContent = "Tu cuenta está bloqueada por múltiples intentos fallidos. Contacta al soporte.";
            mensajeLogin.classList.remove("d-none");
            return;
        }

        const usuario = obtenerUsuarioPorCorreo(correo);

        if (!usuario || usuario.password !== password) {
            const estado = registrarIntentoFallido(correo);
            const intentosRestantes = MAX_INTENTOS_FALLIDOS - estado.fallidos;

            if (estado.bloqueado) {
                mensajeLogin.textContent = "Has superado el máximo de intentos permitidos. Tu cuenta ha sido bloqueada.";
            } else {
                mensajeLogin.textContent = "Correo o contraseña incorrectos. Intentos restantes: " + intentosRestantes + ".";
            }
            mensajeLogin.classList.remove("d-none");
            return;
        }

        reiniciarIntentos(correo);
        iniciarSesion(correo);
        window.location.href = "index.html";
    });
});
