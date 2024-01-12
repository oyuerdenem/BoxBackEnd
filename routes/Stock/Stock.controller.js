const express = require('express');
const router = express.Router();

//mongodb
const Stock = require('./Stock.model');

const verifyJWT = require('../../middleware/verifyJWT');

/**
 * Read
 */
router.get('/', verifyJWT, async(req, res) => {

})