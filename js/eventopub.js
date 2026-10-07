document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    const idEvento = params.get('id');
    
    const STORAGE_KEY = 'misConciertosData';
    const conciertos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    if (idEvento !== null && conciertos[idEvento]) {
        const evento = conciertos[idEvento];

        if(document.getElementById('pub-nombre')) {
            document.getElementById('pub-nombre').textContent = evento.nombre;
        }
        
        if(document.getElementById('pub-categoria')) {
            document.getElementById('pub-categoria').textContent = evento.categoria || 'General';
        }

        if(document.getElementById('pub-precio')) {
            document.getElementById('pub-precio').textContent = `Q${evento.precio || 0}`;
        }

        if(document.getElementById('pub-hora')) {
            document.getElementById('pub-hora').textContent = evento.hora || 'Por confirmar';
        }

        if(document.getElementById('pub-imagen')) {
            document.getElementById('pub-imagen').src = evento.imagen || 'https://via.placeholder.com/400';
        }

        if(document.getElementById('pub-descripcion')) {
            document.getElementById('pub-descripcion').textContent = evento.descripcion || 'Sin descripción.';
        }

        const btnComprar = document.getElementById('btn-comprar-detalle');
        if (btnComprar) {
            btnComprar.onclick = () => {
                registrarVenta(evento);
            };
        }

    } else {
        console.error("No se encontró el evento con ID:", idEvento)}

    function registrarVenta(concierto) {
        const historial = JSON.parse(localStorage.getItem('registroVentas')) || [];
        
        //historial
        const nuevaVenta = {
            cliente: {
                nombre: "Venta Directa",
                id: "S/N"
            },
            productos: [
                {
                    nombre: concierto.nombre,
                    precio: concierto.precio || 0
                }
            ],
            total: concierto.precio || 0,
            fecha: new Date().toLocaleString(),
            idReferencia: "REF-" + Math.floor(Math.random() * 900000 + 100000)
        };

        historial.push(nuevaVenta);
        localStorage.setItem('registroVentas', JSON.stringify(historial));

        alert(`¡Entrada adquirida!\nEvento: ${concierto.nombre}\nPrecio: Q${nuevaVenta.total}`);
    }
});