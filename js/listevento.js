const STORAGE_KEY = 'misConciertosData';

document.addEventListener('DOMContentLoaded', () => {
    const tabla = document.getElementById('lista-inventario-body');
    if (!tabla) return;

    function cargarInventario() {
        const datosGuardados = DB.get(STORAGE_KEY);

        if (datosGuardados.length === 0) {
            tabla.innerHTML = `<tr><td colspan="6" class="mensaje-vacio-tabla">No hay conciertos.</td></tr>`;
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
                <td class="id-evento">#${index}</td>
                <td class="acciones-tabla">
                    <button class="btn-editar" data-index="${index}">EDITAR</button>
                    <button class="btn-borrar" data-index="${index}">BORRAR</button>
                </td>
            </tr>
        `).join('');

        tabla.innerHTML = htmlFilas;
    }

    tabla.addEventListener('click', (e) => {
        const target = e.target;
        const index = target.getAttribute('data-index');
        if (index === null) return;

        if (target.classList.contains('btn-editar')) {
            window.location.href = `eventos.html?editId=${index}`;
        } else if (target.classList.contains('btn-borrar')) {
            if (confirm("¿Borrar concierto, Knight?")) {
                DB.deleteItem(STORAGE_KEY, index);
                cargarInventario();
            }
        }
    });

    cargarInventario();
});