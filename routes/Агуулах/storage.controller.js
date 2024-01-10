const express = require('express');
const router = express.Router();

//mongodb
const storage = require('./storage.model');

const verifyJWT = require('../../middleware/verifyJWT');

/**
 * Create
 */
router.post('/', verifyJWT, async(data, res) => {
    let {name, location} = data.body;
    name = name.trim();
    location = location.trim();

    if(!name || !location){
        return res.json({
            success: false,
            message: "empty input fields."
        })
    }
    
    const newStorage = new storage({
        name, location
    });

    // if(!/z[a-zA-z]*$/.test(name)){
    //     res.json({
    //         status: "failed",
    //         message: "invalid name entered."
    //     })
    // } else {
    //     Storage.find({storageID}).then(result => {
    //         if(result.length){
    //             //storage already exists
    //             res.json({
    //                 status: "failed",
    //                 message: "Storage with the provided ID already exists."
    //             })
    //         } else {
                
    //         }
    //     })
    // }

    newStorage.save().then(result => {
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
    storage.find().then(data => res.send({
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
            message: "Агуулахын нэр болон хаягийг оруулна"
        })
        return
    }
    storage.findByIdAndUpdate(id, { ...body },
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
        const deletedStorage = await storage.findByIdAndDelete(id);

        if(deletedStorage) {
            res.json({
                success: true,
                message: "Storage deleted successfully.",
                data: deletedStorage
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