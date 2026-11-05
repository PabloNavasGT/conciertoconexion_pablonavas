document.addEventListener('DOMContentLoaded', () => {
    cargarHistorialPorConcierto();
    configurarEventosModal();
});

function cargarHistorialPorConcierto() {
    const VENTAS_KEY = 'registroVentas';
    const contenedorPrincipal = document.getElementById('contenedor-secciones-conciertos');
    if (!contenedorPrincipal) return;

    const ventasGlobales = JSON.parse(localStorage.getItem(VENTAS_KEY)) || [];
    
    if (ventasGlobales.length === 0) {
        contenedorPrincipal.innerHTML = `
            <div class="tarjeta-admin-seccion" style="background-color: var(--tarjeta-bg); padding: 40px; text-align: center; border: 1px solid var(--borde-input);">
                <h2 style="color: var(--texto-suave);">No hay ventas registradas en la plataforma aún.</h2>
            </div>
        `;
        return;
    }

    // 1. Agrupar las transacciones según cada concierto
    const mapaConciertos = {};

    ventasGlobales.forEach(venta => {
        const clienteNombre = venta.cliente ? venta.cliente.nombre : 'Venta Directa';
        const clienteId = venta.cliente ? venta.cliente.id : 'N/A';
        const refId = venta.idReferencia || venta.idVenta || 'REF-000000';
        const fecha = venta.fecha || 'Fecha N/A';

        if (Array.isArray(venta.productos) && venta.productos.length > 0) {
            // Conteo interno si la misma compra trae varias entradas del mismo concierto
            const conteoComprado = {};
            venta.productos.forEach(p => {
                const nombre = p.nombre || 'Entrada General';
                const precio = parseFloat(p.precio || 0);
                if (!conteoComprado[nombre]) {
                    conteoComprado[nombre] = { cantidad: 0, precioUnitario: precio };
                }
                conteoComprado[nombre].cantidad += 1;
            });

            Object.entries(conteoComprado).forEach(([nombreConcierto, info]) => {
                if (!mapaConciertos[nombreConcierto]) {
                    mapaConciertos[nombreConcierto] = [];
                }
                mapaConciertos[nombreConcierto].push({
                    fecha,
                    refId,
                    clienteNombre,
                    clienteId,
                    cantidad: info.cantidad,
                    precioUnitario: info.precioUnitario,
                    subtotal: info.cantidad * info.precioUnitario,
                    ventaOriginal: venta
                });
            });
        } else {
            const nombreConcierto = venta.nombreEvento || 'Entrada General';
            const subtotal = parseFloat(venta.total || venta.precio || 0);
            const cant = venta.cantidad || 1;
            const unitario = subtotal / cant;

            if (!mapaConciertos[nombreConcierto]) {
                mapaConciertos[nombreConcierto] = [];
            }
            mapaConciertos[nombreConcierto].push({
                fecha,
                refId,
                clienteNombre,
                clienteId,
                cantidad: cant,
                precioUnitario: unitario,
                subtotal,
                ventaOriginal: venta
            });
        }
    });

    contenedorPrincipal.innerHTML = '';

    // 2. Generar una tarjeta con su propia tabla y buscador por cada concierto
    Object.entries(mapaConciertos).forEach(([nombreConcierto, listaVentas], index) => {
        const idBuscador = `buscar-concierto-${index}`;
        const idTbody = `tbody-concierto-${index}`;
        const idTotal = `total-concierto-${index}`;

        const seccionHTML = document.createElement('div');
        seccionHTML.className = 'tarjeta-admin-seccion';
        seccionHTML.style.cssText = 'background-color: var(--tarjeta-bg); padding: 30px; border-radius: 4px; border: 1px solid var(--rojo-neon); box-shadow: var(--glow-naranja);';

        seccionHTML.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; border-bottom: 2px solid var(--rojo-neon); padding-bottom: 15px;">
                <h2 style="font-family: 'Montserrat', sans-serif; color: var(--blanco); font-size: 1.4rem; text-transform: uppercase; margin: 0;">
                    <span style="color: var(--rosa-neon);">🎤 Concierto:</span> ${nombreConcierto}
                </h2>
                <input type="text" id="${idBuscador}" placeholder="Buscar en ${nombreConcierto}..." style="padding: 10px 14px; background: var(--gris-input); border: 1px solid var(--borde-input); color: var(--blanco); border-radius: 2px; width: 300px; font-family: 'Share Tech Mono', monospace;">
            </div>

            <div class="tabla-responsive">
                <table class="tabla-custom">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Referencia</th>
                            <th>Cliente</th>
                            <th>Entradas</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody id="${idTbody}"></tbody>
                </table>
            </div>

            <div style="text-align: right; margin-top: 15px; font-size: 1.1rem; color: var(--amarillo-neon); font-weight: bold;">
                Total Recaudado en este Evento: <span id="${idTotal}">Q0.00</span>
            </div>
        `;

        contenedorPrincipal.appendChild(seccionHTML);

        // Función para renderizar filas de este concierto específico
        const renderizarFilasConcierto = (filas) => {
            const tbody = document.getElementById(idTbody);
            const totalSpan = document.getElementById(idTotal);
            tbody.innerHTML = '';
            let totalEvento = 0;

            if (filas.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:25px; color:gray;">No hay coincidencias para este concierto.</td></tr>';
                totalSpan.textContent = 'Q0.00';
                return;
            }

            filas.forEach(v => {
                totalEvento += v.subtotal;
                const tr = document.createElement('tr');
                tr.className = 'fila-compra';

                tr.innerHTML = `
                    <td>${v.fecha}</td>
                    <td><span class="badge" style="color: var(--amarillo-neon);">${v.refId}</span></td>
                    <td>
                        <strong>${v.clienteNombre}</strong><br>
                        <small style="color:gray;">ID: ${v.clienteId}</small>
                    </td>
                    <td><span style="color: var(--rosa-neon); font-weight: bold;">x${v.cantidad}</span></td>
                    <td>Q${v.precioUnitario.toFixed(2)}</td>
                    <td style="color: #00ff00; font-weight: bold;">Q${v.subtotal.toFixed(2)}</td>
                `;

                tr.addEventListener('click', () => abrirModalDetalle(v.ventaOriginal));
                tbody.appendChild(tr);
            });

            totalSpan.textContent = `Q${totalEvento.toFixed(2)}`;
        };

        // Cargar filas iniciales del concierto
        renderizarFilasConcierto(listaVentas);

        // Escuchador exclusivo para la barra de búsqueda de este concierto
        const inputSearch = document.getElementById(idBuscador);
        inputSearch.addEventListener('input', (e) => {
            const termino = e.target.value.toLowerCase().trim();
            const filtradas = listaVentas.filter(v => 
                v.clienteNombre.toLowerCase().includes(termino) ||
                v.refId.toLowerCase().includes(termino) ||
                v.fecha.toLowerCase().includes(termino)
            );
            renderizarFilasConcierto(filtradas);
        });
    });
}

function abrirModalDetalle(venta) {
    const modal = document.getElementById('modal-detalle-compra');
    const refId = venta.idReferencia || venta.idVenta || 'REF-000000';
    
    document.getElementById('modal-titulo-ref').textContent = `Compra #${refId}`;
    document.getElementById('modal-fecha').textContent = `Fecha de transacción: ${venta.fecha || 'N/A'}`;
    
    if (venta.cliente) {
        document.getElementById('modal-cliente-nombre').textContent = `Cliente: ${venta.cliente.nombre || 'N/A'}`;
        document.getElementById('modal-cliente-datos').textContent = `ID: ${venta.cliente.id || 'N/A'} | Correo: ${venta.cliente.correo || 'N/A'} | Teléfono: ${venta.cliente.telefono || 'N/A'}`;
    } else {
        document.getElementById('modal-cliente-nombre').textContent = 'Cliente: Venta Directa';
        document.getElementById('modal-cliente-datos').textContent = 'Sin datos de contacto adicionales.';
    }

    const listaUI = document.getElementById('modal-lista-productos');
    listaUI.innerHTML = '';

    if (Array.isArray(venta.productos) && venta.productos.length > 0) {
        const agrupar = {};
        venta.productos.forEach(p => {
            const nom = p.nombre || 'Entrada';
            const precio = parseFloat(p.precio || 0);
            if (!agrupar[nom]) {
                agrupar[nom] = { cantidad: 0, subtotal: 0 };
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
    } else {
        const total = parseFloat(venta.total || venta.precio || 0);
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${venta.nombreEvento || 'Entrada General'}</strong> (x1)</span>
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