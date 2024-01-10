const express = require('express');
const router = express.Router();

//mongodb
const Supplier = require('./supplier.model');

const verifyJWT = require('../../middleware/verifyJWT');

/**
 * Create
 */
router.post('/', verifyJWT, async (data, res) => {   
    let {name, location } = data.body;

    const newSupplier = new Supplier({
        name, location
    });

    newSupplier.save().then(result => {
        res.json({
            success: true,
            message: "Added successfully.",
            data: result
        })
    }).catch (err => res.json({
        success: false,
        message: err
    }))
})

/**
 * Read
 */
router.get('/', verifyJWT, async(req, res) => {
    Supplier.find().then(data => res.send({
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
router.put('/:id', verifyJWT, (req, res) => {
    const id = req.params?.id;
    const body = {
        name: req.body?.name,
        location: req.body?.location
    }

    if(!body?.name && !body?.location){
        res.json({
            success: false,
            message: "sponsor нэр болон хаягийг оруулна"
        })
        return
    }
    Supplier.findByIdAndUpdate(id, { ...body }
    ).then(data => res.json({
        success: true,
        values: data
    })).catch(err => res.json({
        success: false,
        message: err
    }))
});

/**
 * Delete
 */
router.delete('/:id', verifyJWT, async(req, res) => {
    try{
        const id = req.params.id;
        const deletedSupplier = await Supplier.findByIdAndDelete(id);

        if(deletedSupplier) {
            res.json({
                status: true,
                message: "supplier deleted successfully.",
                data: deletedSupplier
            })
        } else {
            res.json({
                status: false,
                message: err.message || err
            })
        }
    } catch (err){
        res.json({
            status: false,
            message: err.message || err
        })
    }
})

module.exports = router;