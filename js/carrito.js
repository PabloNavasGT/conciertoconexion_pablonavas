const CARRITO_KEY = 'carritoTemporal';
const VENTAS_KEY = 'registroVentas';
const CONCIERTOS_KEY = 'misConciertosData';

document.addEventListener('DOMContentLoaded', () => {
    actualizarTotalInterfaz();

    const contenedorItems = document.getElementById('contenedor-items');
    if (contenedorItems) {
        renderizarListaCarrito();

        // Escuchador único para los botones de eliminar
        contenedorItems.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-eliminar')) {
                const index = e.target.getAttribute('data-index');
                quitarDelCarrito(index);
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

    const htmlItems = lista.map((item, index) => `
        <div class="item-carrito">
            <div>
                <strong class="texto-naranja">${item.nombre}</strong><br>
                <small>Q${parseFloat(item.precio || 0).toFixed(2)}</small>
            </div>
            <button class="btn-eliminar" data-index="${index}">Eliminar</button>
        </div>
    `).join('');

    contenedor.innerHTML = htmlItems;
}

function quitarDelCarrito(index) {
    DB.deleteItem(CARRITO_KEY, index); 
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

    const conciertosGlobales = DB.get(CONCIERTOS_KEY);

 carrito.forEach(itemCarrito => {
        const idx = conciertosGlobales.findIndex(c => c.nombre === itemCarrito.nombre);
        if (idx !== -1) {
            conciertosGlobales[idx].vendidos = (conciertosGlobales[idx].vendidos || 0) + 1;
        }
    });
    
    DB.set(CONCIERTOS_KEY, conciertosGlobales);

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