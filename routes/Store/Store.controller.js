const express = require('express');
const router = express.Router();

//mongodb
const Store = require('./Store.model');

const SaleModel = require('../Sale/Sale.model');

const verifyJWT = require('../../middleware/verifyJWT');

/**
 * Create 
 */
router.post('/', verifyJWT, async (data, res) => {
    let { Name, Location } = data.body;
    Name = Name.trim();
    Location = Location.trim();

    if (!Name || !Location) {
        return res.json({
            success: false,
            message: "empty input fields."
        })
    }

    const newStore = new Store({
        Name, Location
    });

    newStore.save().then(result => {
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
router.get('/', verifyJWT, async (req, res) => {
    Store.find().then(data => res.send({
        success: true, values: data
    })).catch(err => res.send({
        success: false,
        values: [],
        message: err.message || err
    }))
});

/**
 * Update
 */
router.put('/:id', verifyJWT, (req, res) => {
    const id = req.params.id;
    const { Name, Location } = req.body;

    if (!Name && !Location) {
        res.json({
            success: false,
            message: "Please provide both Name and Location."
        })
        return
    }

    Store.findByIdAndUpdate(id,
        { Name, Location },
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
router.delete('/:id', verifyJWT, async (req, res) => {
    try {
        const id = req.params.id;

        const isUsedStore = await SaleModel.findOne({StoreId: id});

        if(isUsedStore){
            return res.json({
                success: false,
                message: "Ene delguuriin medeellliig ustgah bolomjgui"
            });
        }

        const deletedStore = await Store.findByIdAndDelete(id);

        if (deletedStore) {
            res.json({
                success: true,
                message: "Store deleted successfully.",
                data: deletedStore
            })
        } else {
            res.json({
                success: false,
                message: "Store not found."
            })
        }
    } catch (err) {
        console.error(err);
        res.json({
            success: false,
            message: "An error occurred while deleting the Store."
        })
    }
})

module.exports = router;