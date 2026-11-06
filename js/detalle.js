document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const API_URL = 'http://localhost:3000/api/concerts';
    const CARRITO_KEY = 'carritoTemporal';

    if (!id) {
        alert("Evento no válido.");
        window.location.href = "../index.html";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("Evento no encontrado");
        
        const evento = await res.json();

        document.getElementById('det-nombre').innerText = evento.nombre || 'Concierto';
        document.getElementById('det-categoria').innerText = `${evento.categoria || 'General'} | 📍 ${evento.ciudad || 'Guatemala'}`;
        document.getElementById('det-hora').innerText = evento.hora || 'Por confirmar';
        
        let precioBase = parseFloat(evento.precio || 0);
        document.getElementById('det-precio').innerText = `Q${precioBase.toFixed(2)}`;
        document.getElementById('det-descripcion').innerText = evento.descripcion || 'Sin descripción disponible.';
        if (evento.imagen) document.getElementById('det-imagen').src = evento.imagen;

        // Renderizar Ubicación y Opciones de Cargos Extras del Recinto
        const ubicacionElem = document.getElementById('det-ubicacion');
        const recintoInfo = document.getElementById('det-recinto-info');
        
        let extraSeleccionado = 0;
        let nombreZonaSeleccionada = "Entrada General";

        if (evento.recinto) {
            const r = evento.recinto;
            ubicacionElem.innerText = `Ubicación: ${r.nombreLugar || evento.ciudad} (${r.direccion || 'Sin dirección'})`;
            
            let htmlRecinto = `<p><strong>Tipo de Recinto:</strong> ${r.tipo.toUpperCase()}</p>`;
            
            if (r.cargosExtrasZonas && Object.keys(r.cargosExtrasZonas).length > 0) {
                htmlRecinto += `
                    <div class="campo" style="margin-top: 15px;">
                        <label for="select-zona-recinto" style="color: var(--amarillo-neon);">Elige tu Zona (Cargo extra opcional):</label>
                        <select id="select-zona-recinto" style="width: 100%; padding: 10px; background: var(--gris-input); color: var(--blanco); border: 1px solid var(--borde-input); border-radius: 2px;">
                            <option value="0|Entrada General">Entrada Estándar (Sin cargo extra)</option>
                `;

                for (const [zona, cargoExtra] of Object.entries(r.cargosExtrasZonas)) {
                    if (cargoExtra >= 0) {
                        htmlRecinto += `<option value="${cargoExtra}|${zona}">${zona.toUpperCase()} (+Q${cargoExtra.toFixed(2)})</option>`;
                    }
                }

                htmlRecinto += `</select></div>`;
            }
            recintoInfo.innerHTML = htmlRecinto;

            // Escuchar cambios en la zona seleccionada para actualizar el precio en tiempo real
            setTimeout(() => {
                const selectZona = document.getElementById('select-zona-recinto');
                if (selectZona) {
                    selectZona.addEventListener('change', (e) => {
                        const partes = e.target.value.split('|');
                        extraSeleccionado = parseFloat(partes[0]) || 0;
                        nombreZonaSeleccionada = partes[1];

                        const precioFinalTotal = precioBase + extraSeleccionado;
                        document.getElementById('det-precio').innerText = `Q${precioFinalTotal.toFixed(2)}`;
                    });
                }
            }, 100);

        } else {
            ubicacionElem.innerText = `Ubicación: ${evento.ciudad || 'Guatemala'}`;
            recintoInfo.innerHTML = '';
        }

        // Botón para añadir al carrito con el recargo aplicado
        document.getElementById('btn-comprar-det').addEventListener('click', () => {
            const cantidad = parseInt(document.getElementById('cantidad-boletos').value) || 1;
            const carrito = DB.get(CARRITO_KEY);
            const precioTotalUnitario = precioBase + extraSeleccionado;
            const nombreItemConZona = `${evento.nombre} [${nombreZonaSeleccionada}]`;

            for (let i = 0; i < cantidad; i++) {
                carrito.push({
                    id: evento._id || evento.id,
                    nombre: nombreItemConZona,
                    precio: precioTotalUnitario
                });
            }

            DB.set(CARRITO_KEY, carrito);
            alert(`¡${cantidad} entrada(s) (${nombreZonaSeleccionada}) agregada(s) al carrito!`);
            window.location.href = "carrito.html";
        });

    } catch (err) {
        console.error(err);
        alert("No se pudo cargar la información del evento.");
        window.location.href = "../index.html";
    }
});