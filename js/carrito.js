const CARRITO_KEY = 'carritoTemporal';

document.addEventListener('DOMContentLoaded', () => {
    actualizarTotalInterfaz();

    const contenedorItems = document.getElementById('contenedor-items');
    if (contenedorItems) {
        renderizarListaCarrito();

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
        contenedor.innerHTML = '<p class="mensaje-vacio" style="color: var(--texto-suave); text-align: center; padding: 20px;">Tu carrito está vacío.</p>';
        return;
    }

    // Agrupar por nombre exacto (incluyendo zona seleccionada)
    const agrupados = {};
    lista.forEach(item => {
        const nombre = item.nombre || 'Entrada General';
        const precio = parseFloat(item.precio || 0);
        if (!agrupados[nombre]) {
            agrupados[nombre] = { cantidad: 0, precioUnitario: precio };
        }
        agrupados[nombre].cantidad += 1;
    });

    const htmlItems = Object.entries(agrupados).map(([nombre, info]) => {
        const subtotal = info.precioUnitario * info.cantidad;
        return `
            <div class="item-carrito" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--borde-input);">
                <div>
                    <strong style="color: var(--rosa-neon); font-size: 1.05rem;">${nombre}</strong> 
                    ${info.cantidad > 1 ? `<span style="color: var(--amarillo-neon); font-size: 0.9rem; font-weight: bold;">(x${info.cantidad})</span>` : ''}<br>
                    <small style="color: var(--texto-suave);">Subtotal: Q${subtotal.toFixed(2)} (Q${info.precioUnitario.toFixed(2)} c/u)</small>
                </div>
                <button class="btn-eliminar btn-borrar" data-nombre="${nombre}">Eliminar todos</button>
            </div>
        `;
    }).join('');

    contenedor.innerHTML = htmlItems;
}

function quitarGrupoDelCarrito(nombreItem) {
    let lista = DB.get(CARRITO_KEY);
    lista = lista.filter(item => item.nombre !== nombreItem);
    DB.set(CARRITO_KEY, lista);
    
    renderizarListaCarrito();
    actualizarTotalInterfaz();
}