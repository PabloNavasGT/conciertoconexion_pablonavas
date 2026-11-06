// Usamos la misma clave exacta 'misLugaresData' para sincronizar con los eventos
const LUGARES_KEY = 'misLugaresData';

document.addEventListener('DOMContentLoaded', () => {
    // Cargar la tabla inmediatamente al abrir la página
    cargarTablaLugares();

    const formLugar = document.getElementById('form-lugar');
    if (formLugar) {
        formLugar.addEventListener('submit', (e) => {
            e.preventDefault();

            const tipo = document.getElementById('tipo-recinto').value;
            const nombre = document.getElementById('nombre-recinto').value.trim();
            const direccion = document.getElementById('direccion-recinto').value.trim();
            const disponible = document.getElementById('recinto-disponible').checked;

            const nuevoLugar = {
                id: Date.now(),
                nombre,
                tipo,
                direccion,
                disponible
            };

            // Obtener lugares actuales utilizando DB o localStorage directamente
            let lugares = [];
            try {
                lugares = JSON.parse(localStorage.getItem(LUGARES_KEY)) || [];
            } catch (err) {
                lugares = [];
            }

            lugares.push(nuevoLugar);
            localStorage.setItem(LUGARES_KEY, JSON.stringify(lugares));

            alert("¡Recinto registrado con éxito!");
            formLugar.reset();
            
            // Recargar la tabla de inmediato
            cargarTablaLugares();
        });
    }
});

function cargarTablaLugares() {
    const tabla = document.getElementById('tabla-lugares');
    if (!tabla) return;

    let lugares = [];
    try {
        lugares = JSON.parse(localStorage.getItem(LUGARES_KEY)) || [];
    } catch (err) {
        lugares = [];
    }

    tabla.innerHTML = '';

    if (lugares.length === 0) {
        tabla.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:gray;">No hay recintos registrados.</td></tr>';
        return;
    }

    lugares.forEach((lugar, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${lugar.nombre}</strong></td>
            <td><span style="color: var(--rosa-neon); text-transform: uppercase;">${lugar.tipo}</span></td>
            <td>${lugar.direccion}</td>
            <td><button type="button" class="btn-borrar" onclick="eliminarLugar(${index})">Eliminar</button></td>
        `;
        tabla.appendChild(tr);
    });
}

window.eliminarLugar = (index) => {
    let lugares = [];
    try {
        lugares = JSON.parse(localStorage.getItem(LUGARES_KEY)) || [];
    } catch (err) {
        lugares = [];
    }

    lugares.splice(index, 1);
    localStorage.setItem(LUGARES_KEY, JSON.stringify(lugares));
    cargarTablaLugares();
};;