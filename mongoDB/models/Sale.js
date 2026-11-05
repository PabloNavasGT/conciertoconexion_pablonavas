const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    usuario: { type: String, required: true }, // Correo o nombre del usuario activo
    tipoTarjeta: { type: String, required: true }, // 'credito' o 'debito'
    correoContacto: { type: String, required: true },
    productos: [{
        nombre: String,
        precio: Number
    }],
    total: { type: Number, required: true },
    idReferencia: { type: String, required: true }
}, {
    timestamps: true,
    collection: 'sales' // Colección de ventas en MongoDB
});

module.exports = mongoose.model('Sale', saleSchema);