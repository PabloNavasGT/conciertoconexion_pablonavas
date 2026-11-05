document.addEventListener('DOMContentLoaded', () => {
    const tabla = document.getElementById('lista-inventario-body');
    if (!tabla) return;

    const API_URL = 'http://localhost:3000/api/concerts';

    async function cargarInventario() {
        try {
            const res = await fetch(API_URL);
            const datosGuardados = await res.json();

            if (datosGuardados.length === 0) {
                tabla.innerHTML = `<tr><td colspan="6" class="mensaje-vacio-tabla">No hay conciertos registrados en MongoDB.</td></tr>`;
                return;
            }

            const htmlFilas = datosGuardados.map((evento, index) => `
                <tr class="fila-inventario">
                    <td><img src="${evento.imagen || ''}" class="img-mini" alt="${evento.nombre}"></td>
                    <td>
                        <span class="nombre-evento">${evento.nombre}</span><br>
                        <small class="cat-evento">${evento.categoria || 'Sin cat.'}</small>
                    </td>
                    <td class="precio-evento">Q${evento.precio || 0}</td>
                    <td>${evento.hora || '--:--'}</td>
                    <td class="id-evento">#${index + 1}</td>
                    <td class="acciones-tabla">
                        <button class="btn-editar" data-id="${evento._id}">EDITAR</button>
                        <button class="btn-borrar" data-id="${evento._id}">BORRAR</button>
                    </td>
                </tr>
            `).join('');

            tabla.innerHTML = htmlFilas;
        } catch (error) {
            console.error("Error al cargar inventario:", error);
            tabla.innerHTML = `<tr><td colspan="6" class="mensaje-vacio-tabla">Error al conectar con el servidor.</td></tr>`;
        }
    }

    tabla.addEventListener('click', async (e) => {
        const target = e.target;
        const id = target.getAttribute('data-id');
        if (!id) return;

        if (target.classList.contains('btn-editar')) {
            window.location.href = `eventos.html?editId=${id}`;
        } else if (target.classList.contains('btn-borrar')) {
            if (confirm("¿Borrar este concierto de MongoDB, Knight?")) {
                try {
                    const res = await fetch(`${API_URL}/${id}`, {
                        method: 'DELETE'
                    });
                    if (res.ok) {
                        alert("Concierto eliminado correctamente.");
                        cargarInventario();
                    } else {
                        alert("Error al intentar eliminar el concierto.");
                    }
                } catch (error) {
                    console.error("Error de red:", error);
                    alert("No se pudo conectar con el servidor.");
                }
            }
        }
    });

    cargarInventario();
});