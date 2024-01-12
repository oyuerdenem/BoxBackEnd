const express = require('express');
const router = express.Router();

//mongodb
const Warehouse = require('./Warehouse.model');

const verifyJWT = require('../../middleware/verifyJWT');

/**
 * Create
 */
router.post('/', verifyJWT, async(data, res) => {
    let {Name, Location} = data.body;
    Name = Name.trim();
    Location = Location.trim();

    if(!Name || !Location){
        return res.json({
            success: false,
            message: "empty input fields."
        })
    }
    
    const newData = new Warehouse({
        Name, 
        Location
    });

    newData.save().then(result => {
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
    Warehouse.find().then(data => res.send({
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
            message: "Агуулахын нэр болон хаягийг оруулна"
        })  
        return
    }
    Warehouse.findByIdAndUpdate(id, { ...body },
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
        const id = req.params.id;
        const DeletedData = await Warehouse.findByIdAndDelete(id);
        console.log(DeletedData);
        if(DeletedData) {
            res.json({
                success: true,
                message: "Warehouse deleted successfully.",
                data: DeletedData
            })
        } else {
            res.json({
                success: false,
                message: err.message || err
            })
        }
})

module.exports = router;