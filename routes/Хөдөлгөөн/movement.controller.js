const express = require('express');
const router = express.Router();

//mongodb
const MovementModel  = require('./movement.model.js');

//JWT
const verifyJWT = require('../../middleware/verifyJWT');

/**
 * Create
 */
router.post('/', verifyJWT, async (data, res) => {
    let {senderId, recieverId, productId, quantity} = data.body;
    console.log(senderId);
    
    const newData = new MovementModel({
        SendStorageId: senderId,
        RecieveStorageId: recieverId,
        ProductId: productId,
        Quantity: quantity,
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
    .populate("SendStorageId RecieveStorageId ProductId")
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