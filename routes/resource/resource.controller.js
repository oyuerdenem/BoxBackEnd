const express = require('express');
const router = express.Router();

//mongodb
const resource = require('./resource.model');
const storage = require('../Агуулах/storage.model');
const product = require('../Бараа/product.model');


const verifyJWT = require('../../middleware/verifyJWT');

// /**
//  * Create
//  */
// router.post('/', verifyJWT, async(data, res) => {

// })

/**
 * Read
 */
router.get('/', verifyJWT, async(req, res) => {

})

// /**
//  * Update 
//  */
// router.put('/:id', verifyJWT, (req, res) => {

// })

// /**
//  * Delete
//  */
// router.delete('/:id', verifyJWT, async(req, res) => {

// })
