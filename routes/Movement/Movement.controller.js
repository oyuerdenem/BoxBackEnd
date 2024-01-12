const express = require('express');
const router = express.Router();

//mongodb
const MovementModel  = require('./Movement.model.js');

//JWT
const verifyJWT = require('../../middleware/verifyJWT.js');
const StockModel = require('../Stock/Stock.model.js');

/**
 * Create
 */
router.post('/', verifyJWT, async (data, res) => {
    let {SendWarehouseId, RecieveWarehouseId, ProductId, Quantity} = data.body;

    const qty = +Quantity;
    
    const newData = new MovementModel({
        SendWarehouseId: SendWarehouseId,
        RecieveWarehouseId: RecieveWarehouseId,
        ProductId: ProductId,
        Quantity: Quantity,
        DateAt: new Date()
    });

    //finding stock model 
    const StockInfo = await StockModel.findOne({SendWarehouseId:SendWarehouseId, ProductId: ProductId})
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
        const currentQty = await StockModel.findOne({SendWarehouseId: SendWarehouseId, ProductId: ProductId})
            .then(Stock => Stock.Quantity)
            .catch(err => res.json({
                success: false,
                message: "Baraa heden shirheg baigaag medej chadsangui."
            }));

        if(currentQty > qty){
            await StockModel.findByIdAndUpdate(StockInfo._id, {
                Quantity: StockInfo.Quantity - qty
            }).catch(err => res.json({
                success: false,
                message: "Ilgeegchiin too shirheg uurchluh uyd aldaa garlaa."
            }));

            const secondStockInfo = await StockModel.findOne({SendWarehouseId:SendWarehouseId, ProductId: ProductId})
                .catch(err => res.json({
                    success: false,
                    message: "Aldaa garlaa."
                }));

            if(secondStockInfo === null){
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
                await StockModel.findByIdAndUpdate(secondStockInfo._id, {
                    Quantity: secondStockInfo.Quantity + qty
                }).catch(err => res.json({
                    success: false,
                    message: "Huleen awagchiin too shirheg uurchluh uyd aldaa garlaa."
                }));
            }
            

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
});

/**
 * Read
 */
router.get('/', verifyJWT, async(req, res) => {
    MovementModel.find()
    .populate("SendWarehouseId RecieveWarehouseId ProductId")
        .then(data => res
            .send({
                success: true, 
                values: data 
            })
        )
        .catch(err => res
            .send({
                success: false,
                values: [],
                message: err.message || err
            })
        )
})



module.exports = router;