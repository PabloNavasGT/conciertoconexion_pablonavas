document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const idEvento = params.get('id');

    if (!idEvento) {
        console.error("No se encontró el ID del evento en la URL.");
        alert("Error: ID de evento no especificado.");
        window.location.href = '../index.html';
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/concerts');
        if (!res.ok) throw new Error("No se pudo conectar con el servidor.");
        
        const conciertos = await res.json();
        const evento = conciertos.find(c => c._id === idEvento);

        if (evento) {
            const elNombre = document.getElementById('det-nombre');
            const elCategoria = document.getElementById('det-categoria');
            const elPrecio = document.getElementById('det-precio');
            const elHora = document.getElementById('det-hora');
            const elImagen = document.getElementById('det-imagen');
            const elDescripcion = document.getElementById('det-descripcion');
            const elUbicacion = document.getElementById('det-ubicacion');

            if (elNombre) elNombre.textContent = evento.nombre;
            if (elCategoria) elCategoria.textContent = evento.categoria || 'General';
            if (elPrecio) elPrecio.textContent = `Q${evento.precio || 0}`;
            if (elHora) elHora.textContent = evento.hora || 'Por confirmar';
            if (elImagen) elImagen.src = evento.imagen || 'https://via.placeholder.com/400';
            if (elDescripcion) elDescripcion.textContent = evento.descripcion || 'Sin descripción disponible.';
            if (elUbicacion) elUbicacion.textContent = `Ubicación: ${evento.ciudad || 'Capital / Por definir'}`;

            // Configurar el botón para agregar al carrito
            const btnComprar = document.getElementById('btn-comprar-det');
            const inputCantidad = document.getElementById('cantidad-boletos');

            if (btnComprar) {
                btnComprar.onclick = () => {
                    const cantidad = inputCantidad ? parseInt(inputCantidad.value) || 1 : 1;
                    agregarAlCarrito(evento, cantidad);
                };
            }
        } else {
            alert("El concierto no existe en la base de datos de MongoDB.");
            window.location.href = '../index.html';
        }
    } catch (error) {
        console.error("Error al cargar el detalle:", error);
        alert("Error al conectar con el servidor backend.");
    }

    function agregarAlCarrito(concierto, cantidad) {
        const CARRITO_KEY = 'carritoTemporal';
        let carrito = DB.get(CARRITO_KEY);

        // Añadir los ítems repetidos según la cantidad seleccionada
        for (let i = 0; i < cantidad; i++) {
            carrito.push({
                idMongo: concierto._id,
                nombre: concierto.nombre,
                precio: concierto.precio || 0
            });
        }

        DB.set(CARRITO_KEY, carrito);

        alert(`¡Se han añadido ${cantidad} entrada(s) al carrito!\nEvento: ${concierto.nombre}`);
        
        // Redirigir al usuario al carrito para proceder al pago
        window.location.href = "carrito.html";
    }
});