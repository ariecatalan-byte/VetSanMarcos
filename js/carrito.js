/**
 * carrito.js
 * Renderiza el contenido del carrito, permite eliminar productos
 * individualmente, vaciarlo por completo y finalizar la compra
 * (descontando stock y limpiando el carrito).
 */
document.addEventListener("DOMContentLoaded", function () {
    const contenedorItems = document.getElementById("itemsCarrito");
    const carritoVacio = document.getElementById("carritoVacio");
    const cantidadItemsResumen = document.getElementById("cantidadItemsResumen");
    const totalCarritoEl = document.getElementById("totalCarrito");
    const btnVaciar = document.getElementById("btnVaciarCarrito");
    const btnFinalizar = document.getElementById("btnFinalizarCompra");
    const mensajeCompra = document.getElementById("mensajeCompra");

    function renderizarCarrito() {
        const carrito = obtenerCarrito();
        contenedorItems.innerHTML = "";

        if (carrito.length === 0) {
            carritoVacio.classList.remove("d-none");
            btnFinalizar.disabled = true;
            btnVaciar.disabled = true;
        } else {
            carritoVacio.classList.add("d-none");
            btnFinalizar.disabled = false;
            btnVaciar.disabled = false;
        }

        carrito.forEach(function (item) {
            const producto = obtenerProductoPorId(item.idProducto);
            if (!producto) return;

            const fila = document.createElement("div");
            fila.className = "card border-0 shadow-sm";
            fila.innerHTML =
                '<div class="card-body d-flex align-items-center gap-3">' +
                    '<img src="' + producto.imagen + '" class="carrito-item-img" alt="' + producto.nombre + '">' +
                    '<div class="flex-grow-1">' +
                        '<h3 class="h6 fw-bold mb-1">' + producto.nombre + '</h3>' +
                        '<p class="text-secondary mb-0 small">' + formatearCLP(producto.precio) + ' c/u</p>' +
                    '</div>' +
                    '<div class="text-center" style="width: 90px;">' +
                        '<input type="number" min="1" max="' + producto.stock + '" value="' + item.cantidad + '" class="form-control form-control-sm input-cantidad" data-id="' + producto.id + '">' +
                    '</div>' +
                    '<div class="fw-bold" style="width: 110px;">' + formatearCLP(producto.precio * item.cantidad) + '</div>' +
                    '<button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="' + producto.id + '">Eliminar</button>' +
                '</div>';
            contenedorItems.appendChild(fila);
        });

        cantidadItemsResumen.textContent = contarItemsCarrito();
        totalCarritoEl.textContent = formatearCLP(calcularTotalCarrito());
        actualizarBadgeCarrito();

        /* Eventos de edición de cantidad */
        document.querySelectorAll(".input-cantidad").forEach(function (input) {
            input.addEventListener("change", function () {
                const idProducto = input.dataset.id;
                const producto = obtenerProductoPorId(idProducto);
                let nuevaCantidad = parseInt(input.value, 10);

                if (!nuevaCantidad || nuevaCantidad < 1) nuevaCantidad = 1;
                if (nuevaCantidad > producto.stock) {
                    nuevaCantidad = producto.stock;
                    alert("Solo hay " + producto.stock + " unidad(es) disponibles de " + producto.nombre + ".");
                }

                const carrito = obtenerCarrito();
                const item = carrito.find(function (i) { return i.idProducto === idProducto; });
                item.cantidad = nuevaCantidad;
                guardarCarrito(carrito);
                renderizarCarrito();
            });
        });

        /* Eventos de eliminación individual */
        document.querySelectorAll(".btn-eliminar").forEach(function (boton) {
            boton.addEventListener("click", function () {
                eliminarDelCarrito(boton.dataset.id);
                renderizarCarrito();
            });
        });
    }

    btnVaciar.addEventListener("click", function () {
        if (confirm("¿Vaciar todo el carrito de compras?")) {
            vaciarCarrito();
            renderizarCarrito();
        }
    });

    btnFinalizar.addEventListener("click", function () {
        const carrito = obtenerCarrito();
        if (carrito.length === 0) return;

        /* Verificar stock disponible para todos los ítems antes de confirmar */
        for (const item of carrito) {
            const producto = obtenerProductoPorId(item.idProducto);
            if (!producto || producto.stock < item.cantidad) {
                mensajeCompra.className = "alert alert-danger mt-3";
                mensajeCompra.textContent = "No hay stock suficiente de \"" + (producto ? producto.nombre : item.idProducto) + "\" para completar la compra.";
                mensajeCompra.classList.remove("d-none");
                return;
            }
        }

        /* Descontar stock de cada producto */
        carrito.forEach(function (item) { descontarStock(item.idProducto, item.cantidad); });

        vaciarCarrito();
        mensajeCompra.className = "alert alert-success mt-3";
        mensajeCompra.textContent = "¡Compra realizada con éxito! Redirigiendo al inicio...";
        mensajeCompra.classList.remove("d-none");

        setTimeout(function () { window.location.href = "index.html"; }, 1800);
    });

    renderizarCarrito();
});
