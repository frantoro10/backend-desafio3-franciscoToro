const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const productManager = new ProductManager('products.json');

// Middleware para el body-parser
app.use(express.json());

// Ruta para obtener todos los productos
app.get('/products', (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    let products = productManager.getProducts();
    
    if (limit !== undefined) {
        products = products.slice(0, limit);
    }
    
    res.json({ products });
});

// Ruta para obtener un producto por su ID
app.get('/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = productManager.getProductById(productId);
    
    if (product) {
        res.json({ product });
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

