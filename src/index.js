//src/index.js
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors'); // Importar cors
const cartController = require('./controllers/cartController');
const path = require('path');

dotenv.config();

const app = express();


app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: 'http://localhost' })); 


app.use(express.static(path.join(__dirname, '../public')));


app.get('/', (req, res) => {
    res.send('¡Hola! Bienvenido a mi API de Carrito de Compras. Usa el frontend para interactuar.');
});

//Rutas de la API
app.use(cartController);

//Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

//Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});