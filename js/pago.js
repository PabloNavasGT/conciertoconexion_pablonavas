document.addEventListener('DOMContentLoaded', () => {
    const formPago = document.getElementById('form-pago');
    const CARRITO_KEY = 'carritoTemporal';

    formPago.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Obtener datos del formulario de pago
        const tipoTarjeta = document.getElementById('tipo-tarjeta').value;
        const numTarjeta = document.getElementById('num-tarjeta').value.trim();        
        const nombreTitular = document.getElementById('nombre-tarjeta').value.trim();
        const expTarjeta = document.getElementById('exp-tarjeta').value.trim();        
        const cvv = document.getElementById('cvv-tarjeta').value.trim();
        const correo = document.getElementById('correo-pago').value.trim();

        // 2. Validar que el número de tarjeta tenga exactamente 8 dígitos numéricos
        const regexTarjeta = /^[0-9]{8}$/;
        if (!regexTarjeta.test(numTarjeta)) {
            alert("El número de tarjeta debe tener exactamente 8 dígitos numéricos.");
            return;
        }

        // 3. Validar el formato de la fecha de expiración y que el mes no pase de 12
        const regexExp = /^([0-9]{2})[\/\-\(\)]([0-9]{2})$/;
        const matchExp = expTarjeta.match(regexExp);

        if (!matchExp) {
            alert("La fecha de expiración debe tener 2 dígitos a cada lado con un separador en medio (ej: 12/26 o 12(26)).");
            return;
        }

        const mes = parseInt(matchExp[1], 10);
        if (mes < 1 || mes > 12) {
            alert("El mes de expiración (izquierda) no puede irse más de 12 (debe estar entre 01 y 12).");
            return;
        }

        // 4. Obtener el carrito y el usuario activo
        const carrito = DB.get(CARRITO_KEY);
        if (!carrito || carrito.length === 0) {
            alert("Tu carrito está vacío.");
            window.location.href = "carrito.html";
            return;
        }

        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
        const cuentaUsuario = usuarioActivo ? usuarioActivo.nombre : "Invitado";

        const totalVenta = carrito.reduce((acc, item) => acc + parseFloat(item.precio || 0), 0);
        const referenciaID = "REF-" + Math.floor(Math.random() * 900000 + 100000);

        const datosVenta = {
            usuario: cuentaUsuario, 
            tipoTarjeta: tipoTarjeta,
            correoContacto: correo,
            productos: carrito,
            total: totalVenta,
            idReferencia: referenciaID
        };

        try {
            // 5. Enviar al backend para guardar en MongoDB
            const res = await fetch('http://localhost:3000/api/sales/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosVenta)
            });

            const data = await res.json();

            if (res.ok) {
                // Guardar también una copia local por seguridad para el historial visual
                const historialLocal = JSON.parse(localStorage.getItem('registroVentas')) || [];
                historialLocal.push({
                    cliente: { nombre: nombreTitular, correo: correo, id: cuentaUsuario },
                    productos: carrito,
                    total: totalVenta,
                    fecha: new Date().toLocaleString(),
                    idReferencia: referenciaID
                });
                localStorage.setItem('registroVentas', JSON.stringify(historialLocal));

                // Vaciar el carrito temporal
                DB.set(CARRITO_KEY, []);

                alert("¡Cobro realizado con éxito! Redirigiendo a tu ticket QR...");
                
                // 6. Redirigir a Qr.html
                window.location.href = "Qr.html";
            } else {
                alert(data.error || "Error al procesar el pago en el servidor.");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con el servidor backend para registrar la venta.");
        }
    });
});