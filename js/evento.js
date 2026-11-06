document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-evento');
    const selectCategoria = document.getElementById('evento-categoria');
    const selectCiudad = document.getElementById('evento-ciudad'); 
    const selectLugar = document.getElementById('tipo-recinto'); // Ahora este select mostrará los recintos guardados

    const API_URL = 'http://localhost:3000/api/concerts';

    // 1. Cargar categorías
    const cats = JSON.parse(localStorage.getItem('misCategoriasData')) || [];
    if (selectCategoria) {
        selectCategoria.innerHTML = '<option value="">Selecciona Categoría...</option>';
        cats.forEach(c => {
            const o = document.createElement('option');
            o.value = c.nombre;
            o.textContent = c.nombre;
            selectCategoria.appendChild(o);
        });
    }

    // 2. Cargar ciudades
    const ciudadesGuardadas = JSON.parse(localStorage.getItem('misCiudadesData')) || [];
    if (selectCiudad) {
        selectCiudad.innerHTML = '<option value="">Selecciona Ciudad...</option>';
        ciudadesGuardadas.forEach(ciudad => {
            const o = document.createElement('option');
            o.value = ciudad; 
            o.textContent = ciudad;
            selectCiudad.appendChild(o);
        });
    }

    // 3. Cargar los recintos registrados en lugares.html (misLugaresData)
    const lugaresGuardados = JSON.parse(localStorage.getItem('misLugaresData')) || [];
    let recintoSeleccionadoObjeto = null;

    if (selectLugar) {
        selectLugar.innerHTML = '<option value="">Selecciona un Recinto Registrado (Opcional)...</option>';
        lugaresGuardados.forEach(lugar => {
            const o = document.createElement('option');
            o.value = lugar.id; // Usamos el ID o nombre para identificarlo
            o.textContent = `${lugar.nombre} (${lugar.tipo.toUpperCase()})`;
            selectLugar.appendChild(o);
        });

        // Guardar el objeto del recinto cuando el usuario elija uno
        selectLugar.addEventListener('change', (e) => {
            const idBuscado = e.target.value;
            recintoSeleccionadoObjeto = lugaresGuardados.find(l => String(l.id) === String(idBuscado)) || null;
        });
    }

    // 4. Enviar datos completos a MongoDB
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nuevoObjeto = {
            nombre: document.getElementById('evento-nombre').value,
            categoria: selectCategoria.value,
            ciudad: selectCiudad ? selectCiudad.value : "Capital", 
            precio: parseFloat(document.getElementById('evento-precio').value) || 0,
            hora: document.getElementById('evento-hora').value,
            imagen: document.getElementById('evento-imagen').value,
            descripcion: document.getElementById('evento-descripcion').value,
            aforo: parseInt(document.getElementById('evento-aforo').value) || 0,
            vendidos: 0,
            recinto: recintoSeleccionadoObjeto ? {
                tipo: recintoSeleccionadoObjeto.tipo,
                nombreLugar: recintoSeleccionadoObjeto.nombre,
                direccion: recintoSeleccionadoObjeto.direccion,
                cargosExtrasZonas: recintoSeleccionadoObjeto.cargosExtrasZonas || {}
            } : null
        };

        try {
            const res = await fetch(`${API_URL}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoObjeto)
            });

            const data = await res.json();
            if (res.ok) {
                alert("¡Evento publicado con éxito en MongoDB!");
                window.location.href = "invaneventos.html";
            } else {
                alert(data.error || "Error al registrar el evento.");
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("No se pudo conectar con el servidor backend.");
        }
    });
});