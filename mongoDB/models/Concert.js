const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    categoria: { type: String, required: true },
    ciudad: { type: String, required: true },
    precio: { type: Number, required: true },
    hora: { type: String },
    imagen: { type: String },
    descripcion: { type: String },
    aforo: { type: Number, default: 0 },
    vendidos: { type: Number, default: 0 }
}, {
    timestamps: true,
    collection: 'concerts' // Fuerza a que se guarde en la colección 'concerts'
});

module.exports = mongoose.model('Concert', concertSchema);