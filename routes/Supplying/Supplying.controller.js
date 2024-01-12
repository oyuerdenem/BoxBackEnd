const express = require('express');
const router = express.Router();

//mongodb
const ProductModel = require('../Product/Product.model');
const SupplyingModel = require('./Supplying.model');
const StockModel = require('../Stock/Stock.model');

const verifyJWT = require('../../middleware/verifyJWT');

/**
 * Create product
 */
router.post('/', verifyJWT, async (data, res) => {
    let { SupplierId, WarehouseId, ProductId, Quantity } = data.body;

    const Price = await ProductModel.findById(ProductId)
    .then(Product => Product.Price * Quantity)
    .catch(err => res.json({
        success: false,
        message: "Baraanii uniig tootsooloh ved aldaa garlaa"
    }));

    const newData = new SupplyingModel({
        SupplierId: SupplierId,
        WarehouseId: WarehouseId,
        ProductId: ProductId,
        Quantity: Quantity,
        Price: Price,
        DateAt: new Date()
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

    // console.log(newData);

    // const addSupplying = await newData.save().then(data => data).catch(err => res.json({
    //     success: false,
    //     message: err
    // }));

    // //  tatan avalt hiisen baraag tuhain aguulah deer noots ni nemegdeh
    // const getResourse = await StockModel.findOne({ WarehouseId: WarehouseId, ProductId: ProductId }).then(data => data).catch(err => { })

    // // 
    // const updateResourse = await StockModel.findByIdAndUpdate(getResourse._id, {
    //     Quantity: getResourse.Quantity + Quantity
    // }).then(data => data).catch(err => { })

    // res.json({
    //     success: true,
    //     message: "Added successfully.",
    //     data: result
    // })
})

/**
 * Read
 */
router.get('/', verifyJWT, async (req, res) => {
    SupplyingModel.find().populate("SupplierId WarehouseId ProductId").then(data => res.send({
        success: true, values: data
    })).catch(err => res.send({
        success: false,
        values: [],
        message: err.message || err
    }))
})

module.exports = router;