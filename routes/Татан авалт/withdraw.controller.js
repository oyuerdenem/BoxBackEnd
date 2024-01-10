const express = require('express');
const router = express.Router();

//mongodb
const ProductModel = require('../Бараа/product.model');
const StorageModel = require('../Агуулах/storage.model');
const WithdrawModel = require('./withdraw.model');
const SupplierModel = require('../Нийлүүлэгч/supplier.controller');

const verifyJWT = require('../../middleware/verifyJWT');

/**
 * Create product
 */
router.post('/', verifyJWT, async(data, res) => {
    let {supplierId, storageId, productId, quantity} = data.body;

    const price = await ProductModel.findById(productId).then(product => product.price * quantity).catch(err => res.json({
        success: false,
        message: "Baraanii uniig tootsooloh ved aldaa garlaa" + JSON.stringify(err)
    }));
    console.log(price)

    const newData = new WithdrawModel({
        SupplierId: supplierId,
        StorageId: storageId,
        ProductId: productId,
        Quantity: quantity,
        Price: price,
        dateAt: new Date()
    });

    newData.save().then(result => {
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
    WithdrawModel.find().populate("SupplierId StorageId ProductId").then(data => res.send({
        success: true, values: data 
    })).catch(err => res.send({
        success: false,
        values: [],
        message: err.message || err
    }))
})

module.exports = router;