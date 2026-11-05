const CARRITO_KEY = 'carritoTemporal';
const VENTAS_KEY = 'registroVentas';
const CONCIERTOS_KEY = 'misConciertosData';

document.addEventListener('DOMContentLoaded', () => {
    actualizarTotalInterfaz();

    const contenedorItems = document.getElementById('contenedor-items');
    if (contenedorItems) {
        renderizarListaCarrito();

        // Escuchador para los botones de eliminar agrupados
        contenedorItems.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-eliminar')) {
                const nombreItem = e.target.getAttribute('data-nombre');
                quitarGrupoDelCarrito(nombreItem);
            }
        });
    }
});

function actualizarTotalInterfaz() {
    const lista = DB.get(CARRITO_KEY);
    const spanTotal = document.getElementById('suma-total');
    
    if (spanTotal) {
        const total = lista.reduce((acc, item) => acc + parseFloat(item.precio || 0), 0);
        spanTotal.innerText = total.toFixed(2); 
    }
}

function renderizarListaCarrito() {
    const lista = DB.get(CARRITO_KEY);
    const contenedor = document.getElementById('contenedor-items');
    if (!contenedor) return;

    if (lista.length === 0) {
        contenedor.innerHTML = '<p class="mensaje-vacio">Tu carrito está vacío.</p>';
        return;
    }

    // Agrupar elementos por nombre y calcular subtotales y cantidades
    const agrupados = {};
    lista.forEach(item => {
        const nombre = item.nombre || 'Entrada';
        const precio = parseFloat(item.precio || 0);
        if (!agrupados[nombre]) {
            agrupados[nombre] = { cantidad: 0, precioUnitario: precio };
        }
        agrupados[nombre].cantidad += 1;
    });

    // Generar el HTML limpio con los elementos agrupados
    const htmlItems = Object.entries(agrupados).map(([nombre, info]) => {
        const subtotal = info.precioUnitario * info.cantidad;
        return `
            <div class="item-carrito">
                <div>
                    <strong class="texto-naranja">${nombre}</strong> ${info.cantidad > 1 ? `<span style="color: var(--amarillo-neon); font-size: 0.85rem;">(x${info.cantidad})</span>` : ''}<br>
                    <small>Subtotal: Q${subtotal.toFixed(2)} (Q${info.precioUnitario.toFixed(2)} c/u)</small>
                </div>
                <button class="btn-eliminar btn-quitar" data-nombre="${nombre}">Eliminar todos</button>
            </div>
        `;
    }).join('');

    contenedor.innerHTML = htmlItems;
}

function quitarGrupoDelCarrito(nombreItem) {
    let lista = DB.get(CARRITO_KEY);
    // Filtrar la lista para eliminar todas las instancias de ese concierto
    lista = lista.filter(item => item.nombre !== nombreItem);
    DB.set(CARRITO_KEY, lista);
    
    renderizarListaCarrito();
    actualizarTotalInterfaz();
}

window.finalizarCompra = () => {
    const checkEdad = document.getElementById('check-edad');
    const cliId = document.getElementById('cli-id');

    if (!cliId) {
        window.location.href = 'cobrese.html';
        return;
    }

    if (!checkEdad || !checkEdad.checked) {
        alert("!!! Debes confirmar que eres mayor de 18 años para continuar.");
        return;
    }

    const datosCliente = {
        id: cliId.value.trim(),
        nombre: document.getElementById('cli-nombre').value.trim(),
        direccion: document.getElementById('cli-direccion').value.trim(),
        telefono: document.getElementById('cli-telefono').value.trim(),
        correo: document.getElementById('cli-correo').value.trim()
    };

    if (!datosCliente.id || !datosCliente.nombre || !datosCliente.correo) {
        alert("X Por favor, completa los campos obligatorios: ID, Nombre y Correo.");
        return;
    }

    const carrito = DB.get(CARRITO_KEY);
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    // Nota: Si usas MongoDB para los conciertos en el admin, puedes dejar esta sección adaptada o mantener tu lógica actual de historial
    const historialVentas = DB.get(VENTAS_KEY);
    
    const nuevaVenta = {
        cliente: datosCliente,
        productos: carrito,
        total: carrito.reduce((acc, item) => acc + parseFloat(item.precio || 0), 0),
        fecha: new Date().toLocaleString(),
        idReferencia: "REF-" + Math.floor(Math.random() * 900000 + 100000)
    };

    historialVentas.push(nuevaVenta);
    DB.set(VENTAS_KEY, historialVentas);
    
    DB.set(CARRITO_KEY, []); 

    alert(`¡Compra realizada con éxito!\nGracias por tu compra :D, ${datosCliente.nombre}.`);
    window.location.href = "../html/Qr.html"; 
};