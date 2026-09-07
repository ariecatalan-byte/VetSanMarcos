/**
 * index.js
 * Renderiza los productos destacados en la página principal (los 3 con
 * mayor stock, a modo de ejemplo de "productos destacados").
 */
document.addEventListener("DOMContentLoaded", function () {
    const contenedor = document.getElementById("productosDestacados");
    if (!contenedor) return;

    const productos = obtenerProductos()
        .slice()
        .sort(function (a, b) { return b.stock - a.stock; })
        .slice(0, 3);

    productos.forEach(function (producto) {
        const col = document.createElement("div");
        col.className = "col-md-4";
        col.innerHTML =
            '<div class="card producto-card border-0 shadow-sm h-100" onclick="window.location.href=\'detalle.html?id=' + producto.id + '\'">' +
                '<img src="' + producto.imagen + '" class="producto-img" alt="' + producto.nombre + '">' +
                '<div class="card-body">' +
                    '<span class="badge text-bg-light text-dark mb-2">' + (NOMBRES_CATEGORIAS[producto.categoria] || producto.categoria) + '</span>' +
                    '<h3 class="h6 fw-bold">' + producto.nombre + '</h3>' +
                    '<p class="producto-precio mb-0">' + formatearCLP(producto.precio) + '</p>' +
                '</div>' +
            '</div>';
        contenedor.appendChild(col);
    });
});
