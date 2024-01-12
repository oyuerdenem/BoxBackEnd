const express = require('express');
const router = express.Router();

/**
 * Models - Storage, Store, Product
 */
const ProductModel = require('../Product/Product.model');
const SaleModel = require('./Sale.model');

/**
 * Verify 
 */
const verifyJWT = require('../../middleware/verifyJWT');

/**
 * Create
 */
router.post('/', verifyJWT, async(data, res) => {
    let {WarehouseId, StoreId, ProductId, Quantity} = data.body;

    const Price = await ProductModel.findById(ProductId)
    .then(Product =>  Product.Price * Quantity)
    .catch(err => res.json({
        success: false,
        message: "Барааны үнийг тооцоолох явцад алдаа гарлаа!"
    }));
    // console.log(Price)

    const newData = new SaleModel({
        WarehouseId: WarehouseId,
        StoreId: StoreId,
        ProductId: ProductId,
        Quantity: Quantity,
        Price: Price,
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
    SaleModel.find().populate("WarehouseId StoreId ProductId").then(data => res.send({
        success: true,
        values: data
    })).catch(err => res.send({
        success: false, 
        values: [],
        message: err.message || err 
    }))
})

module.exports = router;