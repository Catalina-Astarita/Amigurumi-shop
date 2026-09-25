// =========================================================
// 1. MODO CLARO / OSCURO (CON MEMORIA EN LOCALSTORAGE)
// =========================================================
const botonSol = document.querySelector("#sol");

// Al cargar la página, verificamos si el usuario ya tenía una preferencia guardada
if (localStorage.getItem("modo-oscuro") === "activado") {
    document.body.classList.add("modo-oscuro");
}

function cambiarModo() {
    document.body.classList.toggle("modo-oscuro");
    
    // Guardamos la preferencia en el navegador
    if (document.body.classList.contains("modo-oscuro")) {
        localStorage.setItem("modo-oscuro", "activado");
    } else {
        localStorage.setItem("modo-oscuro", "desactivado");
    }
}

if (botonSol) {
    botonSol.addEventListener("click", cambiarModo);
}


// =========================================================
// 2. FORMULARIO DE AYUDA / CONTACTO
// =========================================================
const formAyuda = document.getElementById("Ayuda");

if (formAyuda) {
    formAyuda.addEventListener("submit", function (e) {
        e.preventDefault();

        const respuesta = confirm("¿Estás seguro de que deseas enviar este formulario?");
        
        if (respuesta) {
            // Se envía el formulario a Formspree
            this.submit();
        }
    });
}


// =========================================================
// 3. SISTEMA DE CARRITO DE COMPRAS CON CONTADOR (+ / -)
// =========================================================

// Recuperamos el carrito guardado o iniciamos uno vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Elementos del DOM
const contadorCarrito = document.querySelector("#contador-carrito");
const contenedorCarrito = document.querySelector("#lista-carrito");
const totalPrecio = document.querySelector("#total-precio");
const btnVaciar = document.querySelector("#vaciar-carrito");
const btnEnviarWhatsapp = document.querySelector("#enviar-whatsapp");

// --- Función para Guardar y Actualizar Visualmente ---
function actualizarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    
    if (contadorCarrito) {
        const totalItems = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
        contadorCarrito.innerText = totalItems;
    }

    renderizarCarrito();
}

// --- Función para Agregar un Producto ---
function agregarAlCarrito(id, nombre, precio) {
    const existe = carrito.find(prod => prod.id === id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    actualizarCarrito();
}

// Escuchador global para botones
document.addEventListener("click", function(e) {
    // 1. Botón "Agregar al carrito" desde la tienda
    if (e.target.classList.contains("btn-agregar")) {
        const id = e.target.dataset.id;
        const nombre = e.target.dataset.nombre;
        const precio = parseFloat(e.target.dataset.precio);
        
        agregarAlCarrito(id, nombre, precio);
    }

    // 2. Botón Aumentar cantidad (+)
    if (e.target.classList.contains("btn-aumentar")) {
        const id = e.target.dataset.id;
        const producto = carrito.find(prod => prod.id === id);
        if (producto) {
            producto.cantidad++;
            actualizarCarrito();
        }
    }

    // 3. Botón Disminuir cantidad (-)
    if (e.target.classList.contains("btn-disminuir")) {
        const id = e.target.dataset.id;
        const producto = carrito.find(prod => prod.id === id);
        if (producto) {
            if (producto.cantidad > 1) {
                producto.cantidad--;
            } else {
                // Si la cantidad llega a 0, se remueve del carrito
                carrito = carrito.filter(prod => prod.id !== id);
            }
            actualizarCarrito();
        }
    }

    // 4. Botón Eliminar producto individual (❌)
    if (e.target.classList.contains("btn-eliminar")) {
        const id = e.target.dataset.id;
        carrito = carrito.filter(prod => prod.id !== id);
        actualizarCarrito();
    }
});

// --- Función para Mostrar Productos en la Lista ---
function renderizarCarrito() {
    if (!contenedorCarrito) return;

    contenedorCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `<p class="text-center text-muted my-3">El carrito está vacío</p>`;
        if (totalPrecio) totalPrecio.innerText = "$0";
        return;
    }

    let total = 0;

    carrito.forEach(prod => {
        const subtotal = prod.precio * prod.cantidad;
        total += subtotal;

        const item = document.createElement("div");
        item.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-3", "border-bottom", "pb-2");
        item.innerHTML = `
            <div>
                <h6 class="mb-1 fw-bold">${prod.nombre}</h6>
                <small class="text-muted">$${prod.precio.toLocaleString()} c/u</small>
            </div>
            
            <div class="d-flex align-items-center gap-2">
                <!-- Selector de Cantidad + / - -->
                <div class="btn-group btn-group-sm" role="group">
                    <button type="button" class="btn btn-outline-secondary btn-disminuir px-2" data-id="${prod.id}">-</button>
                    <span class="btn btn-outline-secondary disabled text-dark fw-bold px-2" style="opacity: 1;">${prod.cantidad}</span>
                    <button type="button" class="btn btn-outline-secondary btn-aumentar px-2" data-id="${prod.id}">+</button>
                </div>

                <span class="fw-bold ms-2" style="min-width: 75px; text-align: right;">$${subtotal.toLocaleString()}</span>
                <button class="btn btn-sm btn-outline-danger border-0 btn-eliminar ms-1" data-id="${prod.id}">&times;</button>
            </div>
        `;
        contenedorCarrito.appendChild(item);
    });

    if (totalPrecio) {
        totalPrecio.innerText = `$${total.toLocaleString()}`;
    }
}

// --- Vaciar Carrito Completo ---
if (btnVaciar) {
    btnVaciar.addEventListener("click", function() {
        carrito = [];
        actualizarCarrito();
    });
}


// =========================================================
// 4. ENVIAR PEDIDO A WHATSAPP
// =========================================================
if (btnEnviarWhatsapp) {
    btnEnviarWhatsapp.addEventListener("click", function() {
        if (carrito.length === 0) {
            alert("Tu carrito está vacío. Agrega productos antes de realizar el pedido.");
            return;
        }

        const telefono = "542215564403";
        
        let mensaje = "¡Hola! Quisiera realizar el siguiente pedido:\n\n";
        let total = 0;

        carrito.forEach(prod => {
            const subtotal = prod.precio * prod.cantidad;
            total += subtotal;
            mensaje += `• ${prod.nombre} x${prod.cantidad} - $${subtotal}\n`;
        });

        mensaje += `\n*Total a pagar: $${total}*`;

        const urlWhatsApp = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        
        window.open(urlWhatsApp, "_blank");
    });
}


// =========================================================
// 5. BÚSQUEDA Y FILTRADO EN TIEMPO REAL
// =========================================================
const inputBusqueda = document.querySelector(".search-input");
const btnBusqueda = document.querySelector(".search-btn");
const contenedorProductos = document.querySelector("#Productos");

// Crear contenedor para mensaje de "Sin resultados"
let mensajeSinResultados = document.createElement("p");
mensajeSinResultados.id = "mensaje-sin-resultados";
mensajeSinResultados.className = "text-center fw-bold fs-5 my-4 d-none";
mensajeSinResultados.textContent = "No se encontraron prendas con esa búsqueda 🔍";

if (contenedorProductos) {
    contenedorProductos.parentNode.insertBefore(mensajeSinResultados, contenedorProductos.nextSibling);
}

function filtrarProductos() {
    if (!inputBusqueda) return;
    
    const textoBuscado = inputBusqueda.value.toLowerCase().trim();
    const tarjetasPromos = document.querySelectorAll("#Promos .card");
    const tarjetasProductos = document.querySelectorAll("#Productos .card");
    
    let visiblesCount = 0;

    // Filtrar Promociones
    tarjetasPromos.forEach(tarjeta => {
        const textoTarjeta = tarjeta.innerText.toLowerCase();
        if (textoTarjeta.includes(textoBuscado)) {
            tarjeta.style.display = "";
            visiblesCount++;
        } else {
            tarjeta.style.display = "none";
        }
    });

    // Filtrar Productos Principales
    tarjetasProductos.forEach(tarjeta => {
        const textoTarjeta = tarjeta.innerText.toLowerCase();
        if (textoTarjeta.includes(textoBuscado)) {
            tarjeta.style.display = "";
            visiblesCount++;
        } else {
            tarjeta.style.display = "none";
        }
    });

    // Mostrar u ocultar mensaje de "no hay resultados"
    if (visiblesCount === 0) {
        mensajeSinResultados.classList.remove("d-none");
    } else {
        mensajeSinResultados.classList.add("d-none");
    }
}

// Evento al escribir en el buscador
if (inputBusqueda) {
    inputBusqueda.addEventListener("input", filtrarProductos);

    // Hacer scroll hacia los productos al presionar 'Enter'
    inputBusqueda.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            const seccionPromos = document.querySelector("#Promos");
            if (seccionPromos) {
                seccionPromos.scrollIntoView({ behavior: "smooth" });
            }
        }
    });
}

// Evento al hacer clic en el botón de la lupa
if (btnBusqueda) {
    btnBusqueda.addEventListener("click", function() {
        filtrarProductos();
        const seccionPromos = document.querySelector("#Promos");
        if (seccionPromos) {
            seccionPromos.scrollIntoView({ behavior: "smooth" });
        }
    });
}

// =========================================================
// 6. ORDENAMIENTO DINÁMICO DE PRODUCTOS Y PROMOS
// =========================================================
const selectOrden = document.querySelector("#select-orden");

function ordenarTarjetas(contenedorSelector) {
    const contenedor = document.querySelector(contenedorSelector);
    if (!contenedor || !selectOrden) return;

    // Convertimos la lista de tarjetas en un Array para poder ordenarlas
    const tarjetas = Array.from(contenedor.children);
    const criterio = selectOrden.value;

    if (criterio === "relevancia") return; // Si es el orden por defecto, no hace nada

    tarjetas.sort((a, b) => {
        // Obtenemos el nombre buscando el elemento <h5> dentro de la tarjeta
        const nombreA = (a.querySelector(".card-title")?.innerText || "").toLowerCase();
        const nombreB = (b.querySelector(".card-title")?.innerText || "").toLowerCase();

        // Obtenemos el precio desde el botón .btn-agregar (data-precio) o limpiando el texto del precio
        const btnA = a.querySelector(".btn-agregar");
        const btnB = b.querySelector(".btn-agregar");
        
        const precioA = btnA ? parseFloat(btnA.dataset.precio) : 0;
        const precioB = btnB ? parseFloat(btnB.dataset.precio) : 0;

        // Criterios de orden
        if (criterio === "precio-asc") {
            return precioA - precioB;
        } else if (criterio === "precio-desc") {
            return precioB - precioA;
        } else if (criterio === "nombre-asc") {
            return nombreA.localeCompare(nombreB);
        } else if (criterio === "nombre-desc") {
            return nombreB.localeCompare(nombreA);
        }
    });

    // Reinsertamos las tarjetas ya ordenadas en el DOM
    tarjetas.forEach(tarjeta => contenedor.appendChild(tarjeta));
}

// Escuchamos el cambio en el selector desplegable
if (selectOrden) {
    selectOrden.addEventListener("change", () => {
        ordenarTarjetas("#Promos");
        ordenarTarjetas("#Productos");
    });
}


// Cargar estado inicial del carrito al abrir la página
actualizarCarrito();