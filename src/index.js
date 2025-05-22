const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Usar mysql2 con promesas
const cartController = require('./controllers/cartController');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: 'http://localhost' }));

// Servir archivos estáticos desde la carpeta public (si la tienes)
app.use(express.static(path.join(__dirname, '../public')));

// Crear conexión a MySQL
const db = mysql.createPool({
    uri: process.env.MONGODB_URI, // Ahora es la URI de MySQL
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probar conexión a MySQL
db.getConnection()
    .then(() => console.log('Conectado a MySQL'))
    .catch(err => console.error('Error al conectar a MySQL:', err));

// Pasar la conexión a los controladores
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Ruta raíz personalizada
app.get('/', (req, res) => {
    res.send('¡Hola! Bienvenido a mi API de Carrito de Compras. Usa el frontend para interactuar.');
});

// Rutas de la API
app.use(cartController);

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});