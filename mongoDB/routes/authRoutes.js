const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// RUTA DE REGISTRO
router.post('/register', async (req, res) => {
    try {
        const { nombre, email, password, adminSecret } = req.body;
        
        const usuarioExistente = await User.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ error: "El correo ya está registrado." });
        }

        // Validar código secreto de administrador
        let rol = 'cliente';
        if (adminSecret === "ROCKADMIN2026") { // Puedes cambiar tu contraseña secreta aquí
            rol = 'admin';
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const nuevoUsuario = new User({
            nombre,
            email,
            password: hashedPassword,
            rol
        });

        await nuevoUsuario.save();
        res.status(201).json({ mensaje: `¡Usuario registrado con éxito como ${rol}!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor al registrar." });
    }
});

// RUTA DE LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ error: "Credenciales inválidas (Correo no encontrado)." });
        }

        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) {
            return res.status(400).json({ error: "Contraseña incorrecta." });
        }

        res.json({
            mensaje: `¡Bienvenido de nuevo, ${usuario.nombre}!`,
            usuario: { 
                nombre: usuario.nombre, 
                email: usuario.email, 
                rol: usuario.rol 
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor al iniciar sesión." });
    }
});

module.exports = router;