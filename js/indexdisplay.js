document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('grid-eventos');
    if (!contenedor) return;

    const inputBusqueda = document.getElementById('input-busqueda');
    const btnFiltroMorado = document.getElementById('btn-filtro');
    const filtroCiudad = document.getElementById('filtro-ciudad');
    const filtroCategoria = document.getElementById('filtro-categoria'); 

    // Obtener datos centralizados desde localStorage mediante la helper DB
    const conciertosOriginales = DB.get('misConciertosData'); 
    const categoriasGuardadas = DB.get('misCategoriasData');
    const ciudadesGuardadas = DB.get('misCiudadesData');

    // Carga dinámicamente el select de Categorías de Música
    function cargarCategoriasDinamicas() {
        if (!filtroCategoria) return;
        const opcionesHTML = categoriasGuardadas
            .map(cat => `<option value="${cat.nombre}">${cat.nombre}</option>`)
            .join('');
        filtroCategoria.innerHTML = '<option value="">Todas las categorías</option>' + opcionesHTML;
    }

    // Carga dinámicamente el select de Ubicaciones / Ciudades
    function cargarCiudadesDinamicas() {
        if (!filtroCiudad) return;
        const opcionesHTML = ciudadesGuardadas
            .map(ciudad => `<option value="${ciudad}">${ciudad}</option>`)
            .join('');
        filtroCiudad.innerHTML = '<option value="">Todas las ubicaciones</option>' + opcionesHTML;
    }

    function renderizar(lista) {
        if (lista.length === 0) {
            contenedor.innerHTML = `<h2 class="mensaje-vacio">No hay coincidencias en esta zona, Knight 🔍</h2>`;
            return;
        }

        const htmlTarjetas = lista.map((evento) => {
            const indiceReal = conciertosOriginales.indexOf(evento);
            const urlDetalle = `html/detalle.html?id=${indiceReal}`;
 
            const vendidos = evento.vendidos || 0;
            const aforo = evento.aforo || 0;
            const disponible = aforo - vendidos;
            const estaAgotado = disponible <= 0 && aforo > 0;

            return `
                <div class="card-concierto ${estaAgotado ? 'agotado' : ''}">
                    <div class="card-imagen ${!estaAgotado ? 'click-detalle' : ''}" data-url="${urlDetalle}">
                        <img src="${evento.imagen || 'https://via.placeholder.com/400x250'}" alt="${evento.nombre}">
                        ${estaAgotado ? '<div class="badge-soldout">SOLD OUT</div>' : ''}
                    </div>

                    <div class="card-info">
                        <h3>${evento.nombre}</h3>
                        <p class="categoria-texto">${evento.categoria || 'General'}</p>
                        <p class="disponibilidad-texto ${disponible <= 5 && !estaAgotado ? 'peligro' : ''}">
                            ${estaAgotado ? 'Sin entradas disponibles' : (disponible <= 5 ? `¡SOLO QUEDAN ${disponible} ENTRADAS!` : (evento.ciudad || 'Ubicación no definida'))}
                        </p>
                        
                        <button class="btn-comprar" data-url="${urlDetalle}" ${estaAgotado ? 'disabled' : ''}>
                            ${estaAgotado ? 'AGOTADO' : `Comprar Q${evento.precio || 0}`}
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        contenedor.innerHTML = htmlTarjetas;
    }

    // Delegación de eventos para la navegación
    contenedor.addEventListener('click', (e) => {
        const elementoConUrl = e.target.closest('[data-url]');
        if (elementoConUrl && !elementoConUrl.hasAttribute('disabled')) {
            const url = elementoConUrl.getAttribute('data-url');
            if (url) window.location.href = url;
        }
    });

    // Lógica de filtrado combinado (Texto + Ubicación + Categoría)
    const ejecutarFiltros = () => {
        const termino = inputBusqueda?.value.toLowerCase().trim() || '';
        const ciudadSel = filtroCiudad?.value || '';
        const categoriaSel = filtroCategoria?.value || '';

        const filtrados = conciertosOriginales.filter(c => {
            const coincideTexto = c.nombre.toLowerCase().includes(termino) || 
                                 (c.categoria && c.categoria.toLowerCase().includes(termino));
            const coincideCiudad = ciudadSel === "" || c.ciudad === ciudadSel;
            const coincideCategoria = categoriaSel === "" || c.categoria === categoriaSel;

            return coincideTexto && coincideCiudad && coincideCategoria;
        });
        
        renderizar(filtrados);
    };

    inputBusqueda?.addEventListener('input', ejecutarFiltros);
    filtroCiudad?.addEventListener('change', ejecutarFiltros);
    filtroCategoria?.addEventListener('change', ejecutarFiltros);

    if (btnFiltroMorado) {
        btnFiltroMorado.addEventListener('click', (e) => {
            e.preventDefault();
            ejecutarFiltros();
        });
    }

    // Inicialización dinámica
    cargarCategoriasDinamicas(); 
    cargarCiudadesDinamicas();
    renderizar(conciertosOriginales);
});