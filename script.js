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
// 3. SISTEMA DE CARRITO DE COMPRAS
// =========================================================

// Recuperamos el carrito guardado o iniciamos uno vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Elementos del DOM (Asegúrate de que existan en tu HTML)
const contadorCarrito = document.querySelector("#contador-carrito");
const contenedorCarrito = document.querySelector("#lista-carrito");
const totalPrecio = document.querySelector("#total-precio");
const btnVaciar = document.querySelector("#vaciar-carrito");
const btnEnviarWhatsapp = document.querySelector("#enviar-whatsapp");

// --- Función para Guardar y Actualizar Visualmente ---
function actualizarCarrito() {
    // Guardar en el navegador
    localStorage.setItem("carrito", JSON.stringify(carrito));
    
    // Actualizar contador del ícono del carrito
    if (contadorCarrito) {
        const totalItems = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
        contadorCarrito.innerText = totalItems;
    }

    // Renderizar la lista dentro del modal/desplegable del carrito
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

// Escuchador global para botones de "Agregar al carrito"
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("btn-agregar")) {
        const id = e.target.dataset.id;
        const nombre = e.target.dataset.nombre;
        const precio = parseFloat(e.target.dataset.precio);
        
        agregarAlCarrito(id, nombre, precio);
    }
});

// --- Función para Mostrar Productos en la Lista ---
function renderizarCarrito() {
    if (!contenedorCarrito) return;

    contenedorCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `<p class="text-center text-muted">El carrito está vacío</p>`;
        if (totalPrecio) totalPrecio.innerText = "$0";
        return;
    }

    let total = 0;

    carrito.forEach(prod => {
        const subtotal = prod.precio * prod.cantidad;
        total += subtotal;

        const item = document.createElement("div");
        item.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-2", "border-bottom", "pb-2");
        item.innerHTML = `
            <div>
                <h6 class="mb-0">${prod.nombre}</h6>
                <small class="text-muted">$${prod.precio} x ${prod.cantidad}</small>
            </div>
            <div>
                <span class="fw-bold me-2">$${subtotal}</span>
                <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${prod.id}">&times;</button>
            </div>
        `;
        contenedorCarrito.appendChild(item);
    });

    if (totalPrecio) {
        totalPrecio.innerText = `$${total}`;
    }
}

// --- Función para Eliminar un Producto Individual ---
if (contenedorCarrito) {
    contenedorCarrito.addEventListener("click", function(e) {
        if (e.target.classList.contains("btn-eliminar")) {
            const id = e.target.dataset.id;
            carrito = carrito.filter(prod => prod.id !== id);
            actualizarCarrito();
        }
    });
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

        const telefono = "542215564403"; //(Código de país + área + número)
        
        let mensaje = "¡Hola! Quisiera realizar el siguiente pedido:\n\n";
        let total = 0;

        carrito.forEach(prod => {
            const subtotal = prod.precio * prod.cantidad;
            total += subtotal;
            mensaje += `• ${prod.nombre} x${prod.cantidad} - $${subtotal}\n`;
        });

        mensaje += `\n*Total a pagar: $${total}*`;

        // Codificamos la cadena para que funcione como URL válida
        const urlWhatsApp = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        
        // Abrimos el chat de WhatsApp en una pestaña nueva
        window.open(urlWhatsApp, "_blank");
    });
}

// Cargar estado inicial del carrito
actualizarCarrito();
