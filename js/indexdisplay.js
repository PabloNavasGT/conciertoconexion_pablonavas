document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('grid-eventos');
    const inputBusqueda = document.getElementById('input-busqueda');
    const btnFiltroMorado = document.getElementById('btn-filtro');
    
    const filtroCiudad = document.getElementById('filtro-ciudad');
    const filtroCategoria = document.getElementById('filtro-categoria');
    
    const STORAGE_KEY = 'misConciertosData';
    const STORAGE_CAT = 'misCategoriasData'; 
    
    const conciertosOriginales = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    function cargarCategoriasDinamicas() {
        const categoriasGuardadas = JSON.parse(localStorage.getItem(STORAGE_CAT)) || [];
        filtroCategoria.innerHTML = '<option value="">Todas las categorías</option>';
        categoriasGuardadas.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.nombre;
            option.textContent = cat.nombre;
            filtroCategoria.appendChild(option);
        });
    }

    function renderizar(lista) {
        contenedor.innerHTML = '';

        if (lista.length === 0) {
            contenedor.innerHTML = `<h2 style="color:white; text-align:center; width:100%; grid-column: 1/-1; padding: 50px;">
                No hay coincidencias en esta zona, Knight 🔍
            </h2>`;
            return;
        }

        lista.forEach((evento) => {
            const indiceReal = conciertosOriginales.indexOf(evento);
            const urlDetalle = `html/detalle.html?id=${indiceReal}`;
            
            //LÓGICA DE AFORO 
            const vendidos = evento.vendidos || 0;
            const aforo = evento.aforo || 0;
            const disponible = aforo - vendidos;
            const estaAgotado = disponible <= 0 && aforo > 0;

            const card = document.createElement('div');
            card.className = 'card-concierto'; 
            
            card.innerHTML = `
                <div class="card-imagen" onclick="${estaAgotado ? '' : `window.location.href='${urlDetalle}'`}" 
                     style="overflow:hidden; border-radius: 8px 8px 0 0; cursor:${estaAgotado ? 'default' : 'pointer'}; position:relative;">
                    <img src="${evento.imagen || 'https://via.placeholder.com/400x250'}" alt="${evento.nombre}" 
                         style="width:100%; display:block; transition: 0.3s; ${estaAgotado ? 'filter: grayscale(1); opacity: 0.5;' : ''}">
                    ${estaAgotado ? '<div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); background:red; color:white; padding:5px 10px; font-weight:bold; border-radius:5px;">SOLD OUT</div>' : ''}
                </div>

                <div class="card-info" style="padding: 15px; text-align: center; background: rgba(255,255,255,0.05);">
                    <h3 style="color: #ff8c00; margin: 0 0 5px 0; font-size: 1.2rem;">${evento.nombre}</h3>
                    <p style="color: #888; font-size: 0.75rem; margin-bottom: 5px; text-transform: uppercase;">
                        ${evento.categoria || 'General'}
                    </p>
                    <p style="color: ${disponible <= 5 && !estaAgotado ? '#ff4444' : '#666'}; font-size: 0.7rem; margin-bottom: 12px; font-weight: ${disponible <= 5 ? 'bold' : 'normal'}">
                         ${estaAgotado ? 'Sin entradas disponibles' : (disponible <= 5 ? `¡SOLO QUEDAN ${disponible} ENTRADAS!` : (evento.ciudad || 'Ubicación no definida'))}
                    </p>
                    
                    <button class="btn-comprar" 
                            ${estaAgotado ? 'disabled' : ''}
                            onclick="window.location.href='${urlDetalle}'" 
                            style="background: ${estaAgotado ? '#333' : 'black'}; color: ${estaAgotado ? '#888' : '#ff8c00'}; border: 2px solid ${estaAgotado ? '#555' : '#ff8c00'}; padding: 10px; cursor: ${estaAgotado ? 'not-allowed' : 'pointer'}; font-weight: bold; width: 100%; border-radius: 6px; transition: 0.2s;">
                        ${estaAgotado ? 'AGOTADO' : `Comprar Q${evento.precio || 0}`}
                    </button>
                </div>
            `;

            if (!estaAgotado) {
                card.onmouseenter = () => card.style.transform = "scale(1.02)";
                card.onmouseleave = () => card.style.transform = "scale(1)";
            }
            card.style.transition = "transform 0.3s";
            contenedor.appendChild(card);
        });
    }

    const ejecutarFiltros = () => {
        const termino = inputBusqueda.value.toLowerCase().trim();
        const ciudadSel = filtroCiudad.value;
        const categoriaSel = filtroCategoria.value;

        const filtrados = conciertosOriginales.filter(c => {
            const coincideTexto = c.nombre.toLowerCase().includes(termino) || 
                                 (c.categoria && c.categoria.toLowerCase().includes(termino));
            const coincideCiudad = ciudadSel === "" || c.ciudad === ciudadSel;
            const coincideCategoria = categoriaSel === "" || c.categoria === categoriaSel;

            return coincideTexto && coincideCiudad && coincideCategoria;
        });
        renderizar(filtrados);};

        inputBusqueda.addEventListener('input', ejecutarFiltros);
        filtroCiudad.addEventListener('change', ejecutarFiltros);
        filtroCategoria.addEventListener('change', ejecutarFiltros);

    if(btnFiltroMorado) {
        btnFiltroMorado.addEventListener('click', (e) => {
            e.preventDefault();
            ejecutarFiltros();
        });
    }

    cargarCategoriasDinamicas(); 
    renderizar(conciertosOriginales);
});