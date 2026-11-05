const express = require('express');
const router = express.Router();
const Concert = require('../models/Concert');

// Obtener todos los conciertos
router.get('/', async (req, res) => {
    try {
        const conciertos = await Concert.find();
        res.json(conciertos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los conciertos" });
    }
});

// Crear un nuevo concierto
router.post('/create', async (req, res) => {
    try {
        const nuevoConcierto = new Concert(req.body);
        await nuevoConcierto.save();
        res.status(201).json({ mensaje: "¡Concierto registrado con éxito en MongoDB!", concierto: nuevoConcierto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al guardar el concierto" });
    }
});

// Eliminar un concierto por ID
router.delete('/:id', async (req, res) => {
    try {
        await Concert.findByIdAndDelete(req.params.id);
        res.json({ mensaje: "Concierto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el concierto" });
    }
});

module.exports = router;