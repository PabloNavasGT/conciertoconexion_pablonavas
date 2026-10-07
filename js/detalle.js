document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const STORAGE_KEY = 'misConciertosData';
    const CARRITO_KEY = 'carritoTemporal';

    const conciertos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    if (id !== null && conciertos[id]) {
        const evento = conciertos[id];

        document.getElementById('det-nombre').textContent = evento.nombre;
        document.getElementById('det-imagen').src = evento.imagen || 'https://via.placeholder.com/300';
        document.getElementById('det-descripcion').textContent = evento.descripcion || "No hay descripción disponible.";
        document.getElementById('det-categoria').textContent = evento.categoria || "General";
        document.getElementById('det-precio').textContent = `Q${evento.precio || 0}`;
        document.getElementById('det-hora').textContent = evento.hora || "Por definir";

        const ubicacionTexto = document.getElementById('det-ubicacion');
        if (ubicacionTexto) {
            ubicacionTexto.textContent = `Ubicación: ${evento.ciudad || 'Guatemala City (Sede Central)'}`;
        }

        const btnComprar = document.getElementById('btn-comprar-det');
        const inputCantidad = document.getElementById('cantidad-boletos');
        
        btnComprar.onclick = () => {
            // Leer la cantidad ingresada (mínimo 1)
            const cantidad = Math.max(1, parseInt(inputCantidad.value) || 1);

            const itemCarrito = {
                nombre: evento.nombre,
                precio: evento.precio || 0,
                imagen: evento.imagen,
                idOriginal: id,
                cantidad: cantidad
            };

            const carritoActual = JSON.parse(localStorage.getItem(CARRITO_KEY)) || [];

            // Si se agregan múltiples entradas, guardamos los elementos según la cantidad elegida
            for (let i = 0; i < cantidad; i++) {
                carritoActual.push({
                    nombre: evento.nombre,
                    precio: evento.precio || 0,
                    imagen: evento.imagen,
                    idOriginal: id
                });
            }

            localStorage.setItem(CARRITO_KEY, JSON.stringify(carritoActual));

            alert(`¡${cantidad} entrada(s) para "${evento.nombre}" agregada(s) al carrito!`);
            window.location.href = 'carrito.html'; // Redirige al carrito con la versión estándar
        };

    } else {
        document.body.innerHTML = "<h1 style='color:white; text-align:center; margin-top:50px;'>Evento no encontrado</h1>";
    }
});