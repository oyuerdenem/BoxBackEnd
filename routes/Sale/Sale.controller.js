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
const StockModel = require('../Stock/Stock.model');

/**
 * Create
 */
router.post('/', verifyJWT, async(data, res) => {
    let {WarehouseId, StoreId, ProductId, Quantity} = data.body;

    const qty = +Quantity;

    const Price = await ProductModel.findById(ProductId)
    .then(Product =>  Product.Price * qty)
    .catch(err => res.json({
        success: false,
        message: "Барааны үнийг тооцоолох явцад алдаа гарлаа!"
    }));
    // console.log(Price)

    const newData = new SaleModel({
        WarehouseId: WarehouseId,
        StoreId: StoreId,
        ProductId: ProductId,
        Quantity: qty,
        Price: Price,
        DateAt: new Date()
    });

    //finding stock model 
    const StockInfo = await StockModel.findOne({WarehouseId: WarehouseId, ProductId: ProductId})
    .catch(err => res.json({
        success: false,
        message: "Aldaa garlaa."
    }));

    if(StockInfo === null){
        return {
            success: false,
            message: "Tus aguulahad tanii hussen baraa baihgui baina."
        }
    } else {
        const currentQty = await StockModel.findOne({WarehouseId: WarehouseId, ProductId: ProductId})
            .then(Stock =>  Stock.Quantity)
            .catch(err => res.json({
                success: false,
                message: "Baraa heden shirheg baigaag awch chadsangui."
            }));

        if(currentQty > qty) {

            await StockModel.findByIdAndUpdate(StockInfo._id, {
                Quantity: StockInfo.Quantity - qty 
            }).catch(err => res.json({
                success: false,
                message: "too shirheg uurchluh uyd aldaa garlaa."
            }))

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
        } else {
            return {
                success: false,
                message: "Aguulahad baigaa baraa hureltsehgui bn."
            }
        }
    }
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