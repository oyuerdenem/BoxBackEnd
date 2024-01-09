const express = require('express');
const router = express.Router();

//mongodb
const movement  = require('./movement.model');


router.post('/movement/add', (req, res) => {
    let {sendStorageID, recieveStorageID, productID, quantity, dateAt} = req.body;
    sendStorageID = sendStorageID.trim();
    recieveStorageID = recieveStorageID.trim();
    productID = productID.trim();
    quantity = quantity.trim();
    dateAt = dateAt.trim();

    if(sendStorageID == "" || recieveStorageID == "" || productID == "" || quantity == "" || dateAt == ""){
        res.json({
            status: "failed",
            message: "empty input fields."
        })
    } else {

    }
})