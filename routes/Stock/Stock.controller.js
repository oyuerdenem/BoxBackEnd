const express = require('express');
const router = express.Router();

//mongodb
const StockModel = require('./Stock.model');

const WarehouseModel = require('../Warehouse/Warehouse.model');
const ProductModel = require('../Product/Product.model');


const verifyJWT = require('../../middleware/verifyJWT');

/**
 * Read
 */
router.get('/', verifyJWT, async(req, res) => {
    StockModel.find().populate("WarehouseId ProductId").then(data => res.send({
        success: true,
        values: data
    })).catch(err => res.send({
        success: false,
        values: [],
        message: err.message || err
    }))
})

module.exports = router;