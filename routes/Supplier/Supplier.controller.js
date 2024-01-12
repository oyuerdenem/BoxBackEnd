const express = require('express');
const router = express.Router();

//mongodb
const SupplierModel = require('./Supplier.model');
const SupplyingModel = require('../Supplying/Supplying.model');

const verifyJWT = require('../../middleware/verifyJWT');

/**
 * Create
 */
router.post('/', verifyJWT, async (data, res) => {   
    let {Name, Location } = data.body;

    const newSupplier = new SupplierModel({
        Name, Location
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
    SupplierModel.find().then(data => res.send({
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
        Name: req.body?.Name,
        Location: req.body?.Location
    }

    if(!body?.Name && !body?.Location){
        res.json({
            success: false,
            message: "sponsor нэр болон хаягийг оруулна"
        })
        return
    }
    SupplierModel.findByIdAndUpdate(id, { ...body }
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

        const isUsedSupplying = await SupplyingModel.findOne({SupplierId: id});

        if(isUsedSupplying){
            return res.json({
                success: false,
                message: "Ene niiluulegch deer tatan avaltiin medeelel bgaa tul ustgah bolomjgui"
            });
        }
        const deletedSupplier = await SupplierModel.findByIdAndDelete(id);

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