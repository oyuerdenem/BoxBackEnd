const express = require('express');
const router = express.Router();

//mongodb
const MovementModel  = require('./Movement.model.js');

//JWT
const verifyJWT = require('../../middleware/verifyJWT.js');

/**
 * Create
 */
router.post('/', verifyJWT, async (data, res) => {
    let {SendWarehouseId, RecieveWarehouseId, ProductId, Quantity} = data.body;
    console.log(SendWarehouseId);
    
    const newData = new MovementModel({
        SendWarehouseId: SendWarehouseId,
        RecieveWarehouseId: RecieveWarehouseId,
        ProductId: ProductId,
        Quantity: Quantity,
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