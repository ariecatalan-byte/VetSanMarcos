/**
 * catalogo.js
 * Renderiza el listado de productos y aplica filtros combinables de
 * categoría, precio máximo y búsqueda por nombre, sin recargar la página.
 */
document.addEventListener("DOMContentLoaded", function () {
    const listaProductos = document.getElementById("listaProductos");
    const selectCategoria = document.getElementById("filtroCategoria");
    const rangoPrecio = document.getElementById("filtroPrecioMax");
    const valorPrecioMax = document.getElementById("valorPrecioMax");
    const inputBuscador = document.getElementById("buscador");
    const btnLimpiar = document.getElementById("btnLimpiarFiltros");
    const contadorResultados = document.getElementById("contadorResultados");
    const sinResultados = document.getElementById("sinResultados");

    const productos = obtenerProductos();

    /* -------- Poblar select de categorías dinámicamente -------- */
    const categorias = Array.from(new Set(productos.map(function (p) { return p.categoria; })));
    categorias.forEach(function (cat) {
        const opcion = document.createElement("option");
        opcion.value = cat;
        opcion.textContent = NOMBRES_CATEGORIAS[cat] || cat;
        selectCategoria.appendChild(opcion);
    });

    /* -------- Configurar rango de precio según catálogo -------- */
    const precioMaximoCatalogo = Math.max.apply(null, productos.map(function (p) { return p.precio; }));
    rangoPrecio.max = precioMaximoCatalogo;
    rangoPrecio.value = precioMaximoCatalogo;
    valorPrecioMax.textContent = formatearCLP(precioMaximoCatalogo);

    /* -------- Leer parámetro ?categoria= de la URL (desde index) -------- */
    const parametros = new URLSearchParams(window.location.search);
    const categoriaInicial = parametros.get("categoria");
    if (categoriaInicial) selectCategoria.value = categoriaInicial;

    function renderizarTarjeta(producto) {
        const col = document.createElement("div");
        col.className = "col-sm-6 col-lg-4 col-xl-3";

        let estadoStockHtml = '<span class="text-success small">En stock</span>';
        if (producto.stock === 0) {
            estadoStockHtml = '<span class="stock-agotado small">Sin stock</span>';
        } else if (producto.stock <= producto.stockCritico) {
            estadoStockHtml = '<span class="stock-bajo small">¡Últimas ' + producto.stock + ' unidades!</span>';
        }

        col.innerHTML =
            '<div class="card producto-card border-0 shadow-sm" data-id="' + producto.id + '">' +
                '<img src="' + producto.imagen + '" class="producto-img" alt="' + producto.nombre + '">' +
                '<div class="card-body d-flex flex-column">' +
                    '<span class="badge text-bg-light text-dark mb-2 align-self-start">' + (NOMBRES_CATEGORIAS[producto.categoria] || producto.categoria) + '</span>' +
                    '<h3 class="h6 fw-bold">' + producto.nombre + '</h3>' +
                    '<p class="producto-precio mb-1">' + formatearCLP(producto.precio) + '</p>' +
                    '<p class="mb-2">' + estadoStockHtml + '</p>' +
                    '<button class="btn btn-primary btn-sm mt-auto btn-agregar" data-id="' + producto.id + '"' + (producto.stock === 0 ? ' disabled' : '') + '>' +
                        (producto.stock === 0 ? 'Sin stock' : 'Añadir al carrito') +
                    '</button>' +
                '</div>' +
            '</div>';
        return col;
    }

    function aplicarFiltros() {
        const categoriaSeleccionada = selectCategoria.value;
        const precioMax = Number(rangoPrecio.value);
        const texto = inputBuscador.value.trim().toLowerCase();

        valorPrecioMax.textContent = formatearCLP(precioMax);

        const filtrados = obtenerProductos().filter(function (p) {
            const coincideCategoria = categoriaSeleccionada === "todas" || p.categoria === categoriaSeleccionada;
            const coincidePrecio = p.precio <= precioMax;
            const coincideTexto = texto === "" || p.nombre.toLowerCase().includes(texto);
            return coincideCategoria && coincidePrecio && coincideTexto;
        });

        listaProductos.innerHTML = "";
        filtrados.forEach(function (p) { listaProductos.appendChild(renderizarTarjeta(p)); });

        contadorResultados.textContent = filtrados.length + " producto(s) encontrado(s).";
        sinResultados.classList.toggle("d-none", filtrados.length !== 0);

        /* Eventos de las tarjetas / botones recién creados */
        document.querySelectorAll(".producto-card").forEach(function (card) {
            card.addEventListener("click", function (e) {
                if (e.target.closest(".btn-agregar")) return; // el botón maneja su propio click
                window.location.href = "detalle.html?id=" + card.dataset.id;
            });
        });

        document.querySelectorAll(".btn-agregar").forEach(function (boton) {
            boton.addEventListener("click", function (e) {
                e.stopPropagation();
                const resultado = agregarAlCarrito(boton.dataset.id, 1);
                actualizarBadgeCarrito();
                boton.textContent = resultado.ok ? "¡Añadido!" : "Sin stock suficiente";
                setTimeout(function () {
                    aplicarFiltros();
                }, 700);
            });
        });
    }

    selectCategoria.addEventListener("change", aplicarFiltros);
    rangoPrecio.addEventListener("input", aplicarFiltros);
    inputBuscador.addEventListener("input", aplicarFiltros);
    btnLimpiar.addEventListener("click", function () {
        selectCategoria.value = "todas";
        rangoPrecio.value = precioMaximoCatalogo;
        inputBuscador.value = "";
        aplicarFiltros();
    });

    aplicarFiltros();
});
