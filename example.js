const express = require('express');
const router = express.Router();
const verifyJWT = require('./middleware/verifyJWT');

//SignUp
router.route('/')
    .get(verifyJWT)

module.exports = router;