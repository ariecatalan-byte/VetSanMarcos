/**
 * detalle.js
 * Lee el parámetro ?id= de la URL, busca el producto en LocalStorage y
 * muestra su ficha completa. Controla la disponibilidad de stock antes
 * de permitir agregarlo al carrito.
 */
document.addEventListener("DOMContentLoaded", function () {
    const parametros = new URLSearchParams(window.location.search);
    const idProducto = parametros.get("id");
    const producto = idProducto ? obtenerProductoPorId(idProducto) : null;

    const ficha = document.getElementById("fichaProducto");
    const noEncontrado = document.getElementById("productoNoEncontrado");

    if (!producto) {
        noEncontrado.classList.remove("d-none");
        return;
    }

    ficha.classList.remove("d-none");
    document.title = "VetCare Store | " + producto.nombre;

    document.getElementById("imgProducto").src = producto.imagen;
    document.getElementById("imgProducto").alt = producto.nombre;
    document.getElementById("categoriaProducto").textContent = NOMBRES_CATEGORIAS[producto.categoria] || producto.categoria;
    document.getElementById("nombreProducto").textContent = producto.nombre;
    document.getElementById("especieProducto").textContent = "Especie: " + producto.especie;
    document.getElementById("precioProducto").textContent = formatearCLP(producto.precio);
    document.getElementById("descripcionProducto").textContent = producto.descripcion;

    const estadoStock = document.getElementById("estadoStock");
    const inputCantidad = document.getElementById("cantidadProducto");
    const btnAgregar = document.getElementById("btnAgregarCarrito");

    function actualizarEstadoStock() {
        const productoActual = obtenerProductoPorId(producto.id);
        if (productoActual.stock === 0) {
            estadoStock.innerHTML = '<span class="stock-agotado">Sin stock disponible</span>';
            inputCantidad.disabled = true;
            btnAgregar.disabled = true;
        } else if (productoActual.stock <= productoActual.stockCritico) {
            estadoStock.innerHTML = '<span class="stock-bajo">Quedan solo ' + productoActual.stock + ' unidad(es)</span>';
            inputCantidad.max = productoActual.stock;
        } else {
            estadoStock.innerHTML = '<span class="text-success">Stock disponible: ' + productoActual.stock + ' unidad(es)</span>';
            inputCantidad.max = productoActual.stock;
        }
    }
    actualizarEstadoStock();

    document.getElementById("formAgregarCarrito").addEventListener("submit", function (e) {
        e.preventDefault();
        const cantidad = parseInt(inputCantidad.value, 10);
        const mensajeDiv = document.getElementById("mensajeCarrito");

        if (!cantidad || cantidad < 1) {
            mensajeDiv.className = "alert alert-danger mt-3";
            mensajeDiv.textContent = "Ingresa una cantidad válida.";
            mensajeDiv.classList.remove("d-none");
            return;
        }

        const resultado = agregarAlCarrito(producto.id, cantidad);
        mensajeDiv.className = "alert mt-3 " + (resultado.ok ? "alert-success" : "alert-danger");
        mensajeDiv.textContent = resultado.mensaje;
        mensajeDiv.classList.remove("d-none");

        if (resultado.ok) {
            actualizarBadgeCarrito();
        }
    });
});
