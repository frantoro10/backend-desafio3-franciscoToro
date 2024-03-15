const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.productIdCounter = 1;
        this.loadProductsFromFile();
    }

    loadProductsFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            if (data) {
                this.products = JSON.parse(data);
                const lastProduct = this.products[this.products.length - 1];
                this.productIdCounter = lastProduct ? lastProduct.id + 1 : 1;
            }
        } catch (err) {
            console.error('Error reading file:', err);
        }
    }

    saveProductsToFile() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (err) {
            console.error('Error writing file:', err);
        }
    }

    addProduct(product) {
        product.id = this.productIdCounter++;
        this.products.push(product);
        this.saveProductsToFile();
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
            this.saveProductsToFile();
            return true;
        }
        return false;
    }

    deleteProduct(id) {
        const initialLength = this.products.length;
        this.products = this.products.filter(product => product.id !== id);
        if (this.products.length < initialLength) {
            this.saveProductsToFile();
            return true;
        }
        return false;
    }
}

// Uso
const productManager = new ProductManager('products.json');


productManager.addProduct({
    title: 'Producto de ejemplo',
    description: 'Descripción de prueba',
    price: 999,
    thumbnail: 'thumbnail.ejemplo.png',
    code: 'EJEMPLO123',
    stock: 20
});

console.log(productManager.getProducts());
console.log(productManager.getProductById(1));
productManager.updateProduct(1, { price: 1299 });
console.log(productManager.getProducts());
productManager.deleteProduct(1);
console.log(productManager.getProducts());