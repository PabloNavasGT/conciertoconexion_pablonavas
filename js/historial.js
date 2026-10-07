document.addEventListener('DOMContentLoaded', () => {
    cargarHistorial();
    configurarEventosModal();
});

let ventasGlobales = [];

function cargarHistorial() {
    const VENTAS_KEY = 'registroVentas';
    const tabla = document.getElementById('tabla-ventas');
    if (!tabla) return;
    
    ventasGlobales = JSON.parse(localStorage.getItem(VENTAS_KEY)) || [];
    const ventasOrdenadas = [...ventasGlobales].reverse(); 

    tabla.innerHTML = '';
    let granTotalRecaudado = 0;

    if (ventasOrdenadas.length === 0) {
        tabla.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:50px; color:gray;">No hay ventas registradas aún.</td></tr>';
        return;
    }

    ventasOrdenadas.forEach((venta, index) => {
        const fila = document.createElement('tr');
        fila.className = 'fila-compra';
        
        // 1. Datos del Cliente
        const clienteNombre = venta.cliente ? venta.cliente.nombre : 'Venta Directa';
        const clienteId = venta.cliente ? venta.cliente.id : 'N/A';

        // 2. Resumen de Productos
        let nombresProductos = '';
        if (Array.isArray(venta.productos) && venta.productos.length > 0) {
            const contexConteo = {};
            venta.productos.forEach(p => {
                const nombre = p.nombre || 'Producto';
                contexConteo[nombre] = (contexConteo[nombre] || 0) + 1;
            });
            nombresProductos = Object.entries(contexConteo)
                .map(([nombre, cant]) => cant > 1 ? `${nombre} (x${cant})` : nombre)
                .join(', ');
        } else if (venta.nombreEvento) {
            const cant = venta.cantidad || 1;
            nombresProductos = cant > 1 ? `${venta.nombreEvento} (x${cant})` : venta.nombreEvento;
        } else {
            nombresProductos = 'Entrada General';
        }

        // 3. Monto y Referencia
        const totalVenta = parseFloat(venta.total || venta.precio || 0);
        const refId = venta.idReferencia || venta.idVenta || 'REF-000000';

        granTotalRecaudado += totalVenta;

        fila.innerHTML = `
            <td>${venta.fecha || 'Fecha N/A'}</td>
            <td><span class="badge">${refId}</span></td>
            <td>
                <strong>${clienteNombre}</strong><br>
                <small style="color:gray;">ID: ${clienteId}</small>
            </td>
            <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${nombresProductos}">
                ${nombresProductos}
            </td>
            <td style="color: #00ff00; font-weight: bold;">Q${totalVenta.toFixed(2)}</td>
        `;

        // Evento Click para abrir el modal con el detalle
        fila.addEventListener('click', () => abrirModalDetalle(venta));

        tabla.appendChild(fila);
    });

    // Fila del Total Recaudado
    const filaTotal = document.createElement('tr');
    filaTotal.innerHTML = `
        <td colspan="4" style="text-align:right; font-weight:bold; padding:15px; color:#ff8c00;">TOTAL RECAUDADO:</td>
        <td style="color: #00ff00; font-weight: bold; font-size: 1.2rem; background: #222;">Q${granTotalRecaudado.toFixed(2)}</td>
    `;
    tabla.appendChild(filaTotal);
}

function abrirModalDetalle(venta) {
    const modal = document.getElementById('modal-detalle-compra');
    const refId = venta.idReferencia || venta.idVenta || 'REF-000000';
    
    document.getElementById('modal-titulo-ref').textContent = `Compra #${refId}`;
    document.getElementById('modal-fecha').textContent = `Fecha de transacción: ${venta.fecha || 'N/A'}`;
    
    // Cliente
    if (venta.cliente) {
        document.getElementById('modal-cliente-nombre').textContent = `Cliente: ${venta.cliente.nombre || 'N/A'}`;
        document.getElementById('modal-cliente-datos').textContent = `ID: ${venta.cliente.id || 'N/A'} | Correo: ${venta.cliente.correo || 'N/A'} | Teléfono: ${venta.cliente.telefono || 'N/A'}`;
    } else {
        document.getElementById('modal-cliente-nombre').textContent = 'Cliente: Venta Directa';
        document.getElementById('modal-cliente-datos').textContent = 'Sin datos de contacto adicionales.';
    }

    // Desglose de productos
    const listaUI = document.getElementById('modal-lista-productos');
    listaUI.innerHTML = '';

    if (Array.isArray(venta.productos) && venta.productos.length > 0) {
        const agrupar = {};
        venta.productos.forEach(p => {
            const nom = p.nombre || 'Entrada';
            const precio = parseFloat(p.precio || 0);
            if (!agrupar[nom]) {
                agrupar[nom] = { cantidad: 0, subtotal: 0, precioUnitario: precio };
            }
            agrupar[nom].cantidad += 1;
            agrupar[nom].subtotal += precio;
        });

        Object.entries(agrupar).forEach(([nombre, info]) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span><strong>${nombre}</strong> (x${info.cantidad})</span>
                <span style="color:#00ff00;">Q${info.subtotal.toFixed(2)}</span>
            `;
            listaUI.appendChild(li);
        });
    } else if (venta.nombreEvento) {
        const cant = venta.cantidad || 1;
        const total = parseFloat(venta.precio || venta.total || 0);
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${venta.nombreEvento}</strong> (x${cant})</span>
            <span style="color:#00ff00;">Q${total.toFixed(2)}</span>
        `;
        listaUI.appendChild(li);
    }

    const totalVenta = parseFloat(venta.total || venta.precio || 0);
    document.getElementById('modal-total-pago').textContent = `Q${totalVenta.toFixed(2)}`;

    modal.style.display = 'flex';
}

function configurarEventosModal() {
    const modal = document.getElementById('modal-detalle-compra');
    const btnCerrar = document.getElementById('btn-cerrar-modal');

    if (btnCerrar) {
        btnCerrar.onclick = () => { modal.style.display = 'none'; };
    }

    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
}