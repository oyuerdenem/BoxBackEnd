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
            success: false,
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
                success: true,
                message: "Product deleted successfully.",
                data: deletedProduct
            })
        } else {
            res.json({
                success: false,
                message: err.message || err
            })
        }
    } catch (err) {
        console.error(err);
        res.json({
            success: false,
            message: err.message || err
        })
    }
})

module.exports = router;