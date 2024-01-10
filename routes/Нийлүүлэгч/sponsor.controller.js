const express = require('express');
const router = express.Router();

//mongodb
const Sponsor = require('./sponsor.model');

const verifyJWT = require('../../middleware/verifyJWT');

/**
 * Create
 */
router.post('/', verifyJWT, async (data, res) => {   
    let {name, location } = data.body;
    name = name.trim();
    location = location.trim();

    if(!name || !location){
        return res.json({
            success: false,
            message: "empty input fields."
        })
    }
    
    const newSponsor = new Sponsor({
        name, location
    });

    newSponsor.save().then(result => {
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
    Sponsor.find().then(data => res.send({
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
    Sponsor.findByIdAndUpdate(id, { ...body }
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
        const deletedSponsor = await Sponsor.findByIdAndDelete(id);

        if(deletedSponsor) {
            res.json({
                status: true,
                message: "sponsor deleted successfully.",
                data: deletedSponsor
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