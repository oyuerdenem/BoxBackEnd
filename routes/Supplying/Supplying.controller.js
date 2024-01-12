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
    const qty = +Quantity;

    const Price = await ProductModel.findById(ProductId)
        .then(Product => Product.Price * qty)
        .catch(err => res.json({
            success: false,
            message: "Baraanii uniig tootsooloh ved aldaa garlaa"
        }));

    const newData = new SupplyingModel({
        SupplierId: SupplierId,
        WarehouseId: WarehouseId,
        ProductId: ProductId,
        Quantity: qty,
        Price: Price,
        DateAt: new Date()
    });


    // finding stock model
    const StockInfo = await StockModel.findOne({ WarehouseId: WarehouseId, ProductId: ProductId })
        .catch(err => res.json({
            success: false,
            message: "Too shirhegiig bodohod asuudal garlaa daa ho."
        }));
    console.log('StockInfo: ', StockInfo);

    if (StockInfo === null) {
        const newStockData = new StockModel({
            WarehouseId: WarehouseId,
            ProductId: ProductId,
            Quantity: qty,
            DateAt: new Date()
        })
        await newStockData.save().catch(err => res.json({
            success: "false",
            message: "shineer stock -iin medeelel uusegh ved aldaa garlaa"
        }))
    } else {
        // update stock
        await StockModel.findByIdAndUpdate(StockInfo._id, {
            Quantity: StockInfo.Quantity + qty
        }).catch(err => res.json({  
            success: false,
            message: "Nuutsiin medeelel oorchloh ved aldaa garlaa"
        }))
    }

    newData.save().then(result => {
        res.json({
            success: true,
            message: "Added successfully.",
            data: result
        })
    }).catch(err => res.json({
        success: false,
        message: err
    }));

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