const express = require('express');
const router = express.Router();

//mongodb
const sales = require('./sales.model');
// const stores = require('../Дэлгүүр/store.model');
// const storages = require('../Агуулах/storage.model');

const verifyJWT = require('../../middleware/verifyJWT');

/**
 * Create -> Агуулах, Дэлгүүр болон Барааны хүснэгтээс шалгаад бүртгэдэг байх
 */
router.post('/', verifyJWT, async (data, res) => {
    let {SendStorageId, RecieveStoreId, SendProduct, Quantity, dateAt} = data.body;
    SendStorageId = SendStorageId.trim();
    RecieveStoreId = RecieveStoreId.trim();
    SendProduct = SendProduct.trim();
    Quantity = Quantity.trim();
    dateAt = dateAt.trim();

    if(!SendProduct || !SendStorageId || !RecieveStoreId){
        return res.json({
            success: false,
            message: "empty input fields."
        })
    }

    const newSale = new sales({
        SendStorageId, RecieveStoreId, SendProduct, Quantity, dateAt
    })

    newSale.save().then(result => {
        res.json({
            success: true,
            message: "Added successfully.",
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
    sales.find().then(data => res.send({
        success: true,
        values: data
    })).catch(err => res.send({
        success: false,
        values: [],
        message: err.message || err
    }))
})

/**
 * Update
 */
router.put(':/id', verifyJWT, (req, res) => {
    const id = req.params.id;
    const {SendStorageId, RecieveStoreId, SendProduct, Quantity, dateAt} = req.body;

    if(!SendStorageId && !RecieveStoreId && !SendProduct && !Quantity && !dateAt){
        res.json({
            success: false,
            message: "Pls provide both informations."
        })
        return
    }

    sales.findByIdAndUpdate(id,
        {SendStorageId, RecieveStoreId, SendProduct, Quantity ,dateAt}
    ).then(data => res.json({
        success: true,
        values: data 
    })).catch(err => res.json({
        success: false,
        message: err 
    }))
})

/**
 * Delete
 */
router.delete('/:id', verifyJWT, async(req, res) => {
    try{
        const id = req.params.id;
        const deletedSale = await sales.findByIdAndDelete(id);

        if(deletedSale){
            res.json({
                success: true,
                message: "Sale deleted successfully",
                data: deletedSale
            })
        } else {
            res.json({
                success: false,
                message: err.message || err 
            })
        }
    } catch (err){
        console.error(err);
        res.json({
            success: false,
            message: err.message || err
        })
    }
})

module.exports = router;