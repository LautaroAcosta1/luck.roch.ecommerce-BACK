require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express(); // Inicializa Express

console.log("Mongo URI:", process.env.MONGO_URI); // Verifica qué imprime

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Conectado a MongoDB"))
.catch(err => console.log("Error conectando a MongoDB:", err));

// Middleware
app.use(express.json()); // Para leer JSON en las peticiones
app.use(cors()); // Para permitir la conexión con el frontend

// Rutas de productos
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes); // Rutas con prefijo '/api/products'

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));



