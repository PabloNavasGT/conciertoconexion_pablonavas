const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');

router.post('/create', async (req, res) => {
    try {
        const { usuario, tipoTarjeta, correoContacto, productos, total, idReferencia } = req.body;

        const nuevaVenta = new Sale({
            usuario,
            tipoTarjeta,
            correoContacto,
            productos,
            total,
            idReferencia
        });

        await nuevaVenta.save();
        res.status(201).json({ mensaje: "¡Venta registrada con éxito en MongoDB!" });
    } catch (error) {
        console.error("Error al guardar la venta:", error);
        res.status(500).json({ error: "Error en el servidor al procesar el cobro." });
    }
});

module.exports = router;