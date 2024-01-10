const express = require('express');
const router = express.Router();

//mongodb
const movement  = require('./movement.model.js');

const verifyJWT = require('../../middleware/verifyJWT');

/**
 * Create
 */
router.post('/', verifyJWT, async (req, res) => {
    try {
        let { SendStorageId, ReceiveStorageId, SendProduct, productID, quantity } = req.body;
        SendStorageId = SendStorageId ? SendStorageId.trim() : '';
        ReceiveStorageId = ReceiveStorageId ? ReceiveStorageId.trim() : '';
        SendProduct = SendProduct ? SendProduct.trim() : '';
        productID = productID ? productID.trim() : '';
        quantity = quantity ? quantity.trim() : '';
        const dateAt = new Date();

        if (!SendStorageId || !ReceiveStorageId) {
            return res.json({
                success: false,
                message: "Empty input fields."
            });
        }

        const newMovement = new Movement({
            sendStorageID: SendStorageId,
            ReceiveStorageId: ReceiveStorageId,
            productID: productID,
            quantity: quantity,
            dateAt: dateAt
        });

        const result = await newMovement.save();
        res.json({
            success: true,
            message: "Successfully added.",
            data: result
        });
    } catch (err) {
        res.json({
            success: false,
            message: err.message || err
        });
    }
});

/**
 * Read
 */
router.get('/', verifyJWT, async(req, res) => {
    movement.find().then(data => res.send({
        success: true, values: data
    })).catch(err => req.send({
        success: false,
        values: [],
        message: err.message || err
    }))
})

/**
 * Update
 */
router.put('/', verifyJWT, (req, res) => {
    const id = req.params.id;
    const { SendStorageId, ReceiveStorageId, SendProduct, Quantity, dateAt } = req.body;

    if (!SendStorageId && !ReceiveStorageId && !SendProduct && !Quantity && !dateAt) {
        res.json({
            success: false,
            message: "Please provide at least one information to update."
        });
        return;
    }

    Sales.findByIdAndUpdate(id,
        { SendStorageId, ReceiveStorageId, SendProduct, Quantity, dateAt },
        { new: true } // Return the updated document
    ).then(data => res.json({
        success: true,
        values: data
    })).catch(err => res.json({
        success: false,
        message: err
    }));
})

/**
 * Delete
 */
router.delete('/', verifyJWT, async(req, res) => {
    try{
        const id = req.params.id;
        const deletedMovement = await movement.findByIdAndDelete(id);

        if(deletedMovement){
            res.json({
                status: "SUCCESS",
                message: "Sale deleted successfully",
                data: deletedMovement
            })
        } else {
            res.json({
                status: false,
                message: err.message || err 
            })
        }
    } catch (err){
        console.error(err);
        res.json({
            status: false,
            message: err.message || err
        })
    }
})

module.exports = router;