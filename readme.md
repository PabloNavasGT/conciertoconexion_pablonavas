# 🎸 Conciertos Conexión - Plataforma de Gestión de Conciertos y Venta de Entradas

**Conciertos Conexión** es una aplicación Web Full-Stack desarrollada para la gestión, publicación de conciertos, administración modular de recintos, control de aforos y pasarela de pago de entradas en Guatemala. Cuenta con una arquitectura modular escalable, autenticación de usuarios basada en roles (**Usuario** / **Administrador**) y una interfaz visual moderna estilo neón-cyber orientada a la alta interacción.

---

## 📂 Estructura del Proyecto (Cómo Funciona)

El proyecto sigue una arquitectura limpia por capas separando la infraestructura, la lógica de negocio y las vistas del cliente:

```text
📦 conciertos-conexion/
 ┣ 📂 .vscode/
 ┣ 📂 node_modules/
 ┣ 📂 css/
 ┃  ┣ 📜 base.css               # Estilos globales, paleta de colores y diseño base cyber-neon
 ┃  ┣ 📜 carrito.css            # Estilos específicos para el carrito, pasarela y detalles
 ┃  ┗ 📜 index.css              # Estilos de la cartelera principal y filtros
 ┣ 📂 html/
 ┃  ┣ 📜 eventos.html           # Panel de administración para publicar nuevos eventos y recintos
 ┃  ┣ 📜 invaneventos.html      # Inventario y control de conciertos activos en MongoDB
 ┃  ┣ 📜 lugares_3.html         # Módulo de gestión y registro de estadios, teatros y recintos
 ┃  ┣ 📜 detalle.html           # Vista detallada del concierto, selección de zonas y compra
 ┃  ┣ 📜 carrito.html           # Vista de entradas seleccionadas y agrupación inteligente (xN)
 ┃  ┣ 📜 cobrese.html           # Pasarela de pago de tarjetas con validación estricta
 ┃  ┗ 📜 seguritas.html         # Panel de gestión de cuenta y perfil de usuario
 ┣ 📂 js/
 ┃  ┣ 📜 evento.js              # Lógica del formulario de creación y vinculación de recintos
 ┃  ┣ 📜 lugares_3.js           # Lógica CRUD para el almacenamiento local de recintos y zonas
 ┃  ┣ 📜 indexdisplay.js        # Lógica de renderizado de la cartelera y filtrado dinámico
 ┃  ┣ 📜 detalle.js             # Cálculo en tiempo real de precios base + cargos opcionales por zona
 ┃  ┣ 📜 carrito.js             # Lógica de agregación, conteo y subtotalización de boletos
 ┃  ┗ 📜 pago.js                # Validación de tarjetas (8 dígitos) y registro de ventas a la API
 ┣ 📂 src/
 ┃  ┣ 📂 config/
 ┃  ┃  ┗ 📜 database.js          # Configuración de la conexión a la Base de Datos (Mongoose/MongoDB)
 ┃  ┣ 📂 controllers/
 ┃  ┃  ┣ 📜 authController.js     # Lógica de registro e inicio de sesión de usuarios
 ┃  ┃  ┣ 📜 concertController.js  # Lógica CRUD para la gestión de conciertos y recintos en BD
 ┃  ┃  ┗ 📜 saleController.js     # Lógica de procesamiento y registro de transacciones de venta
 ┃  ┣ 📂 middleware/
 ┃  ┃  ┗ 📜 authMiddleware.js     # Validación de tokens JWT y control de privilegios (Admin/User)
 ┃  ┣ 📂 models/
 ┃  ┃  ┣ 📜 concert.js          # Esquema de datos de conciertos, aforos y recintos (MongoDB)
 ┃  ┃  ┣ 📜 sale.js             # Esquema de datos para las ventas e historial (MongoDB)
 ┃  ┃  ┗ 📜 user.js               # Esquema de datos de usuarios y roles
 ┃  ┗ 📂 routes/
 ┃     ┣ 📜 authRoutes.js         # Rutas de autenticación de la API
 ┃     ┣ 📜 concertRoutes.js      # Rutas públicas y protegidas para conciertos
 ┃     ┗ 📜 saleRoutes.js         # Rutas de registro de pasarela de pagos
 ┣ 📜 .env                        # Variables de entorno (Puerto, URI de BD, Secretos JWT)
 ┣ 📜 .gitignore                  # Archivos ignorados por Git
 ┣ 📜 app.js                      # Configuración central de Express y middlewares globales
 ┣ 📜 server.js                   # Punto de entrada (Entry point) para arrancar el servidor
 ┗ 📜 index.html                  # Cartelera pública principal de la plataforma


 🚀 Cómo se Utiliza
Autenticación: El usuario accede a la plataforma, donde puede iniciar sesión con sus credenciales o registrarse mediante las vistas de cuenta.

Cartelera Principal (index.html): Muestra el listado completo de conciertos disponibles con su respectiva categoría, ciudad y precio base.

Búsqueda y Filtros: Permite filtrar eventos instantáneamente por nombre de artista/concierto, ubicación (ciudades de Guatemala) y categorías musicales.

Modo Administrador (indexplus.html): Los usuarios con privilegios de administrador pueden acceder al panel avanzado para publicar nuevos eventos (eventos.html), administrar el inventario de conciertos (invaneventos.html) y configurar recintos u espacios alternativos (lugares_3.html).

⚙️ Pasos para que Funcione Adecuadamente
Sigue estos pasos en tu terminal para poner en marcha el proyecto localmente:

Clonar o abrir el repositorio en tu entorno de trabajo (como Visual Studio Code).

Instalar las dependencias del proyecto ejecutando:

Bash
npm install
Configurar las variables de entorno: Asegúrate de tener un archivo .env en la raíz con los parámetros necesarios:

Fragmento de código
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/conciertos_conexion
JWT_SECRET=tu_clave_secreta_aqui
Iniciar el servidor:

En modo desarrollo (con recarga automática):

Bash
npm run dev
En inicio estándar:

Bash
npm start
Abrir en el navegador: Entra a http://localhost:3000/index.html.

🔄 Flujo Detallado de Funcionamiento
1. Registro y Autenticación (Register / Login)
Punto de partida: El usuario accede al sistema e interactúa con el flujo de acceso.

Proceso técnico: Ingresa sus datos y credenciales. El formulario se comunica mediante la capa de cliente con los endpoints en authRoutes.js.

Backend: El authController.js procesa la petición, encripta la credencial y genera un Token JWT (JSON Web Token) firmado digitalmente que contiene la identidad y el rol del usuario (asignando por defecto el rol de user).

2. Cartelera Pública (index.html)
Acceso: Libre para cualquier visitante o usuario autenticado.

Funcionamiento:

El sistema consulta los conciertos activos directamente desde MongoDB a través de concertRoutes.js.

El usuario visualiza las tarjetas de los conciertos y puede utilizar los selectores de filtrado por ciudad y categoría.

Al hacer clic en un evento, se redirige a la vista detallada (detalle.html).

3. Detalle del Concierto y Selección de Zonas (detalle.html)
Funcionamiento:

Carga la información del concierto seleccionado (imagen, descripción, hora, precio base y detalles del recinto).

Si el recinto cuenta con opciones configuradas (como Gradas, Palcos o Butacas), despliega un selector dinámico con cargos extras sumables al precio base.

El usuario selecciona la cantidad de entradas y la zona deseada, calculando el subtotal en tiempo real antes de agregarlo al carrito (carrito.html).

4. Carrito de Compras (carrito.html) y Pasarela de Pago (cobrese.html)
Agrupación Inteligente: El carrito agrupa los boletos seleccionados por nombre y localidad (formato xN) y calcula el total acumulado en Quetzales (Q).

Pasarela de Pago:

El usuario ingresa a cobrese.html, donde completa los datos de pago con validaciones estrictas (número de tarjeta exacto de 8 dígitos numéricos, formato de expiración con mes válido de 01 a 12 y CVV de 3 dígitos).

Backend: Al confirmar el cobro, la venta se procesa mediante saleController.js y se almacena en la colección de ventas de MongoDB, vaciando el carrito temporal y generando una referencia única de transacción.

5. Panel de Administrador y Gestión de Recintos (eventos.html / lugares_3.html)
Activación del Modo Admin:

Requiere una cuenta con privilegios de administrador (role: "admin").

Gestión de Recintos y Eventos:

Desde lugares_3.html, el administrador registra estadios, teatros o lugares alternativos especificando su nombre, dirección y disponibilidad.

Desde eventos.html, al publicar un concierto, el administrador vincula el evento al recinto previamente registrado y configura los parámetros del show. Estos datos se envían de forma estructurada a MongoDB a través de concertController.js.

🛡️ ¿Cómo crear una cuenta Modo Administrador?
Para obtener privilegios de Administrador y poder publicar, administrar o eliminar conciertos y recintos en el sistema, asegúrate de configurar tu rol directamente en la base de datos o mediante la clave de privilegios configurada en tu esquema de autenticación de usuarios contraseña secreta = ROCKADMIN2026.