const express = require("express");
const Product = require("../models/product"); // El modelo de producto
const router = express.Router();


// Ruta para obtener todos los productos
router.get("/", async (req, res) => {
    try {
        const products = await Product.find(); // Obtener todos los productos de la DB
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Error obteniendo los productos", error: err.message });
    }
});


// Ruta para agregar un nuevo producto
router.post("/", async (req, res) => {
    try {
        const { name, category, price, imageUrl, quantity} = req.body;

        // Validación básica
        if (!name || !price) {
            return res.status(400).json({ message: "El nombre y el precio son obligatorios" });
        }

        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ message: "El precio debe ser un número positivo" });
        }

        // Crear el nuevo producto
        const newProduct = new Product({ name, category, price, imageUrl, quantity });

        // Guardar el producto en la base de datos
        await newProduct.save();

        res.status(201).json(newProduct); // Devolver el producto creado
    } catch (err) {
        res.status(500).json({ message: "Error al agregar el producto", error: err.message });
    }
});


// Ruta para actualizar un producto existente
router.patch("/:id", async (req, res) => {
    try {
        const { name, category, price, imageUrl, quantity} = req.body;
        const { id } = req.params;

        // Validar que al menos uno de los campos esté presente
        if (!name && !category && !price && !imageUrl && !quantity) {
            return res.status(400).json({ message: "Debe proporcionar al menos un campo para actualizar" });
        }

        // Crear un objeto de datos con los campos enviados
        const productData = { name, category, price, imageUrl, quantity};

        // Filtrar campos vacíos
        for (let key in productData) {
            if (!productData[key]) {
                delete productData[key];
            }
        }

        // Buscar el producto por su id y actualizarlo
        const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar el producto", error: err.message });
    }
});


// Ruta para eliminar un producto
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar el producto por su ID y eliminarlo
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({ message: "Producto eliminado con éxito" });
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar el producto", error: err.message });
    }
});


module.exports = router;

