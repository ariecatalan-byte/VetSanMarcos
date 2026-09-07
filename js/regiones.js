/**
 * regiones.js
 * Arreglo de regiones y comunas de Chile (subconjunto) usado para poblar
 * dinámicamente los select de "Región" y "Comuna" en registro.html.
 * Al cambiar la región, se debe actualizar el select de comunas.
 */
const REGIONES = [
    {
        nombre: "Región Metropolitana de Santiago",
        comunas: ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "Maipú", "Puente Alto"]
    },
    {
        nombre: "Región de Valparaíso",
        comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "San Antonio"]
    },
    {
        nombre: "Región del Biobío",
        comunas: ["Concepción", "Talcahuano", "Los Ángeles", "Chillán"]
    },
    {
        nombre: "Región de Coquimbo",
        comunas: ["La Serena", "Coquimbo", "Ovalle"]
    },
    {
        nombre: "Región de La Araucanía",
        comunas: ["Temuco", "Villarrica", "Angol"]
    },
    {
        nombre: "Región de Los Lagos",
        comunas: ["Puerto Montt", "Osorno", "Castro"]
    }
];

/** Rellena el <select id="region"> con las regiones definidas arriba. */
function poblarSelectRegiones(selectRegion) {
    REGIONES.forEach(function (r) {
        const opcion = document.createElement("option");
        opcion.value = r.nombre;
        opcion.textContent = r.nombre;
        selectRegion.appendChild(opcion);
    });
}

/** Rellena el <select id="comuna"> según la región seleccionada. */
function poblarSelectComunas(selectRegion, selectComuna) {
    selectComuna.innerHTML = '<option value="" selected disabled>-- Seleccione la comuna --</option>';
    const region = REGIONES.find(function (r) { return r.nombre === selectRegion.value; });
    if (!region) return;
    region.comunas.forEach(function (c) {
        const opcion = document.createElement("option");
        opcion.value = c;
        opcion.textContent = c;
        selectComuna.appendChild(opcion);
    });
}
