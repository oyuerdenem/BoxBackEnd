const express = require('express');
const router = express.Router();

//mongodb
const product = require('./product.model');

const verifyJWT = require('../../middleware/verifyJWT');
const { verify } = require('jsonwebtoken');

/**
 * Create product
 */
router.post('/', verifyJWT, async(data, res) => {
    let {name, price} = data.body;
    name = name.trim();
    price = price.trim();

    if(!name || !price){
        return res.json({
            success: false,
            message: "empty input fields."
        })
    }

    const newProduct = new product({
        name, price
    });

    newProduct.save().then(result => {
        res.json({
            success: true,
            message: "Added successfully.",
            data: result 
        })
    }).catch(err => res.json({
        success: false,
        message: err 
    }))
})

/**
 * Read
 */
router.get('/', verifyJWT, async(req, res) => {
    product.find().then(data => res.send({
        success: true, values: data 
    })).catch(err => res.send({
        success: false,
        values: [],
        message: err.message || err
    }))
})


/**
 * Update
 */
router.put('/:id', verifyJWT, (req, res) => {
    const id = req.params.id;
    const { name, price } = req.body;

    if(!name && !price) {
        return res.json ({
            status: false,
            message: err.message || err 
        })
    }

    product.findByIdAndUpdate(id,
        { name, price },
    ).then(data => res.json({
        success: true,
        values: data 
    })).catch(err => res.json({
        success: false,
        message: err
    }))
})

/**
 * Delete
 */
router.delete('/:id', verifyJWT, async(req, res) => {
    try{
        const id = req.params.id;
        const deletedProduct = await product.findByIdAndDelete(id);

        if(deletedProduct){
            res.json({
                status: "SUCCESS",
                message: "Product deleted successfully.",
                data: deletedProduct
            })
        } else {
            res.json({
                status: false,
                message: err.message || err
            })
        }
    } catch (err) {
        console.error(err);
        res.json({
            status: false,
            message: err.message || err
        })
    }
})

module.exports = router;

// const bodyParser = require('body-parser');

// const app = express();
// const PORT = 9000;

// app.use(bodyParser.json());

// let products = [
//   { id: 1, name: 'Product 1', price: 10.99 },
//   { id: 2, name: 'Product 2', price: 19.99 },
//   { id: 3, name: 'Product 3', price: 29.99 },
// ];

// // Get all products
// app.get('/products', (req, res) => {
//   res.json(products);
// });

// // Get a single product by ID
// app.get('/products/:id', (req, res) => {
//   const productId = parseInt(req.params.id);
//   const product = products.find((p) => p.id === productId);

//   if (!product) {
//     return res.status(404).json({ message: 'Product not found' });
//   }

//   res.json(product);
// });

// // Create a new product
// app.post('/products', (req, res) => {
//   const newProduct = req.body;
//   newProduct.id = products.length + 1;
//   products.push(newProduct);

//   res.status(201).json(newProduct);
// });

// // Update a product by ID
// app.put('/products/:id', (req, res) => {
//   const productId = parseInt(req.params.id);
//   const updatedProduct = req.body;
//   const index = products.findIndex((p) => p.id === productId);

//   if (index === -1) {
//     return res.status(404).json({ message: 'Product not found' });
//   }

//   products[index] = { ...products[index], ...updatedProduct };

//   res.json(products[index]);
// });

// // Delete a product by ID
// app.delete('/products/:id', (req, res) => {
//   const productId = parseInt(req.params.id);
//   const index = products.findIndex((p) => p.id === productId);

//   if (index === -1) {
//     return res.status(404).json({ message: 'Product not found' });
//   }

//   const deletedProduct = products.splice(index, 1)[0];

//   res.json(deletedProduct);
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${9000}`);
// });