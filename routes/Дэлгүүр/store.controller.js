const express = require('express');
const router = express.Router();

//mongodb
const store = require('./store.model');

const verifyJWT = require('../../middleware/verifyJWT');

/**
 * Create 
 */
router.post('/', verifyJWT, async (data, res) => {
    let { name, location } = data.body;
    name = name.trim();
    location = location.trim();

    if (!name || !location) {
        return res.json({
            success: false,
            message: "empty input fields."
        })
    }

    const newStore = new store({
        name, location
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
    store.find().then(data => res.send({
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
    const { name, location } = req.body;

    if (!name && !location) {
        res.json({
            success: false,
            message: "Please provide both name and location."
        })
        return
    }

    store.findByIdAndUpdate(id,
        { name, location },
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
        const deletedStore = await store.findByIdAndDelete(id);

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
            message: "An error occurred while deleting the store."
        })
    }
})

module.exports = router;