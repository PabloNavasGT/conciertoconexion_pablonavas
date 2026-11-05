const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const concertRoutes = require('./routes/concertRoutes');

const saleRoutes = require('./routes/saleRoutes');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/conciertos_db';

// Conexión a MongoDB
mongoose.connect(MONGO_URI)
.then(() => console.log("🔥 Conectado exitosamente a MongoDB"))
.catch(err => console.error("Error de conexión a MongoDB:", err));

// Montar las rutas de autenticación
app.use('/api/auth', authRoutes);
app.use('/api/concerts', concertRoutes);
app.use('/api/sales', saleRoutes);
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});