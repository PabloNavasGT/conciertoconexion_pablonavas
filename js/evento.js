document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-evento');
    const selectCategoria = document.getElementById('evento-categoria');
    const selectCiudad = document.getElementById('evento-ciudad'); 
    const selectTipoRecinto = document.getElementById('tipo-recinto');

    const API_URL = 'http://localhost:3000/api/concerts';

    // 1. Cargar categorías desde localStorage
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

    // 2. Cargar ciudades desde localStorage
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

    // 3. Controlar la visualización dinámica de los campos de recinto de forma opcional
    if (selectTipoRecinto) {
        selectTipoRecinto.addEventListener('change', (e) => {
            const valor = e.target.value;

            // Ocultar todas las secciones de recinto primero
            document.querySelectorAll('.seccion-recinto').forEach(sec => {
                sec.style.display = 'none';
            });

            // Mostrar la sección correspondiente si se selecciona
            if (valor === 'estadio-gradas') {
                const sec = document.getElementById('seccion-estadio-gradas');
                if (sec) sec.style.display = 'block';
            } else if (valor === 'estadio-pista') {
                const sec = document.getElementById('seccion-estadio-pista');
                if (sec) sec.style.display = 'block';
            } else if (valor === 'teatro') {
                const sec = document.getElementById('seccion-teatro');
                if (sec) sec.style.display = 'block';
            } else if (valor === 'alternativo') {
                const sec = document.getElementById('seccion-alternativo');
                if (sec) sec.style.display = 'block';
            }
        });
    }

    // 4. Procesar el envío del formulario hacia MongoDB con datos opcionales
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();

        const tipoRecinto = selectTipoRecinto ? selectTipoRecinto.value : '';
        const nombreRecinto = document.getElementById('nombre-recinto')?.value || '';
        const direccionRecinto = document.getElementById('direccion-recinto')?.value || '';
        const recintoDisponible = document.getElementById('recinto-disponible')?.checked ?? true;

        let datosRecintoDetalle = {
            tipo: tipoRecinto || 'No especificado',
            nombreLugar: nombreRecinto,
            direccion: direccionRecinto,
            disponible: recintoDisponible,
            preciosZonas: {},
            cargosVision: {}
        };

        // Recolectar solo si se ingresaron valores numéricos opcionales
        if (tipoRecinto === 'estadio-gradas') {
            datosRecintoDetalle.preciosZonas = {
                gradaInferior: parseFloat(document.getElementById('precio-grada-inf')?.value) || 0,
                gradaIntermediaVIP: parseFloat(document.getElementById('precio-grada-vip')?.value) || 0,
                gradaSuperior: parseFloat(document.getElementById('precio-grada-sup')?.value) || 0
            };
            datosRecintoDetalle.cargosVision = {
                visionFrontal: parseFloat(document.getElementById('vision-frontal-gradas')?.value) || 0,
                visionLateral: parseFloat(document.getElementById('vision-lateral-gradas')?.value) || 0,
                visionObstruida: parseFloat(document.getElementById('vision-obstruida-gradas')?.value) || 0
            };
        } else if (tipoRecinto === 'estadio-pista') {
            datosRecintoDetalle.preciosZonas = {
                pistaCancha: parseFloat(document.getElementById('precio-pista')?.value) || 0,
                tribunas: parseFloat(document.getElementById('precio-tribunas')?.value) || 0,
                zonasVIP: parseFloat(document.getElementById('precio-vip')?.value) || 0
            };
            datosRecintoDetalle.cargosVision = {
                visionFrontal: parseFloat(document.getElementById('vision-frontal-pista')?.value) || 0,
                visionLateral: parseFloat(document.getElementById('vision-lateral-pista')?.value) || 0,
                visionObstruida: parseFloat(document.getElementById('vision-obstruida-pista')?.value) || 0
            };
        } else if (tipoRecinto === 'teatro') {
            datosRecintoDetalle.preciosZonas = {
                butacas: parseFloat(document.getElementById('precio-butacas')?.value) || 0,
                palcos: parseFloat(document.getElementById('precio-palcos')?.value) || 0,
                anfiteatro: parseFloat(document.getElementById('precio-anfiteatro')?.value) || 0,
                balcon1: parseFloat(document.getElementById('precio-balcon-1')?.value) || 0,
                balcon2: parseFloat(document.getElementById('precio-balcon-2')?.value) || 0,
                balcon3: parseFloat(document.getElementById('precio-balcon-3')?.value) || 0,
                galeria: parseFloat(document.getElementById('precio-galeria')?.value) || 0
            };
            datosRecintoDetalle.cargosVision = {
                visionFrontal: parseFloat(document.getElementById('vision-frontal-teatro')?.value) || 0,
                visionLateral: parseFloat(document.getElementById('vision-lateral-teatro')?.value) || 0,
                visionObstruida: parseFloat(document.getElementById('vision-obstruida-teatro')?.value) || 0
            };
        } else if (tipoRecinto === 'alternativo') {
            datosRecintoDetalle.nombreLugarAlternativo = document.getElementById('nombre-lugar-alternativo')?.value || '';
            datosRecintoDetalle.preciosZonas = {
                general: parseFloat(document.getElementById('precio-alternativo')?.value) || 0
            };
        }

        // Obtener el precio base (si no hay zonas llenas, usa el precio principal o 0)
        const primerPrecioZona = Object.values(datosRecintoDetalle.preciosZonas).find(val => val > 0);
        const precioBase = primerPrecioZona || parseFloat(document.getElementById('evento-precio')?.value) || 0;

        const nuevoObjeto = {
            nombre: document.getElementById('evento-nombre').value,
            categoria: selectCategoria.value,
            ciudad: selectCiudad ? selectCiudad.value : "Capital", 
            precio: precioBase,
            hora: document.getElementById('evento-hora').value,
            imagen: document.getElementById('evento-imagen').value,
            descripcion: document.getElementById('evento-descripcion').value,
            aforo: parseInt(document.getElementById('evento-aforo').value) || 0,
            vendidos: 0,
            recinto: datosRecintoDetalle 
        };

        try {
            const res = await fetch(`${API_URL}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoObjeto)
            });

            const data = await res.json();
            if (res.ok) {
                alert("¡Nuevo evento creado con éxito en MongoDB!");
                window.location.href = "invaneventos.html";
            } else {
                alert(data.error || "Error al registrar el evento");
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("No se pudo conectar con el servidor backend.");
        }
    });
});