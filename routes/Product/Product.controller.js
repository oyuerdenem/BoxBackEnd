const express = require('express');
const router = express.Router();

//mongodb
const Product = require('./Product.model');

const MovementModel = require('../Movement/Movement.model');
const SaleModel = require('../Sale/Sale.model');
const SupplyingModel = require('../Supplying/Supplying.model');

const verifyJWT = require('../../middleware/verifyJWT');
// const { verify } = require('jsonwebtoken');

/**
 * Create Product
 */
router.post('/', verifyJWT, async(data, res) => {
    let {Name, Price} = data.body;

    if(!Name || !Price){
        return res.json({
            success: false,
            message: "empty input fields."
        })
    }

    const newProduct = new Product({
        Name, Price
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
    Product.find().then(data => res.send({
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
    const { Name, Price } = req.body;

    if(!Name && !Price) {
        return res.json ({
            success: false,
            message: err.message || err 
        })
    }

    Product.findByIdAndUpdate(id,
        { Name, Price },
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

        const isUsedProductInSupplying = await SupplyingModel.findOne({ProductId: id});
        const isUsedProductInMovement = await MovementModel.findOne({ProductId: id});
        const isUsedProductInSale = await SaleModel.findOne({ProductId: id});

        if(isUsedProductInSupplying || isUsedProductInMovement || isUsedProductInSale){
            return res.json({
                success: false,
                message: "Ene baraag ustgah bolomjgui baina."
            })
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

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