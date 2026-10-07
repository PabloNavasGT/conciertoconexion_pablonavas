document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('form-login');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const nombre = document.getElementById('nombre-admin').value;
            const email = document.getElementById('email-admin').value;
            const pass = document.getElementById('pass-admin').value;

            if (nombre === "kiker" && email === "admin@gmail.com" && pass === "123456") {
                
                alert(`¡Bienvenido de nuevo, ${nombre}! Acceso concedido.`);
                
                localStorage.setItem('adminNombre', nombre);

                window.location.href = "../html/indexplus.html";

            } else {
                alert("Datos incorrectos. ¡Fi, Fay, FO, solo el administrador tiene paso por aquí! ");
            }
        });
    }
});