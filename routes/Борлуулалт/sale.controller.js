const express = require('express');
const router = express.Router();

/**
 * Models - Storage, Store, Product
 */
// const StorageModel = require('../Агуулах/storage.model');
// const StoreModel = require('../Дэлгүүр/store.model');
const ProductModel = require('../Бараа/product.model');

const SaleModel = require('./sale.model');

/**
 * Verify 
 */
const verifyJWT = require('../../middleware/verifyJWT');

/**
 * Create
 */
router.post('/', verifyJWT, async(data, res) => {
    let {storageId, storeId, productId, quantity} = data.body;

    const price = await ProductModel.findById(productId)
    .then(product =>  product.price * quantity)
    .catch(err => res.json({
        success: false,
        message: "Барааны үнийг тооцоолох явцад алдаа гарлаа!"
    }));
    // console.log(price)

    const newData = new SaleModel({
        storageId: storageId,
        storeId: storeId,
        productId: productId,
        quantity: quantity,
        price: price,
        dateAt: new Date()
    });

    newData.save().then(result => {
        res.json({
            success: true,
            message: "",
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
    SaleModel.find().populate("storageId storeId productId").then(data => res.send({
        success: true,
        values: data
    })).catch(err => res.send({
        success: false, 
        values: [],
        message: err.message || err 
    }))
})

module.exports = router;