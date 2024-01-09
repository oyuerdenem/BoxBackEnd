const express = require('express');
const router = express.Router();

//mongodb
const User = require('./User.model');

//password handler
const bcrypt = require('bcrypt');

//jwt
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');
const verifyJWT = require('../../middleware/verifyJWT');


//SignUp
router.post('/signup', (req, res) => {
    let {email, name, password} = req.body;
    email = email.trim();
    name = name.trim();
    password = password.trim();

    if(email == "" || name == "" || password == ""){
        res.json({
            status: "failed",
            message: "empty input fields."
        })
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status: "failed",
            message: "invalid email entered."
        })
    } else if (!/^[a-zA-Z]*$/.test(name)){
        res.json({
            status: "failed",
            message: "invalid name entered."
        })
    } else if (password.length < 8) {
        res.json({
            status: "failed",
            message: "Password is too short."
        })
    } else {
        User.find({email}).then(result => {
            if(result.length){
                //a user already exists
                res.json({
                    status: "failed",
                    message: "User with the provided email already exists."
                })
            } else {
                //try to create new user 

                //password handling 
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser  = new User({
                        email, 
                        name,
                        password: hashedPassword
                    })

                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "Signup successful",
                            data: result
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: "failed",
                            message: "An error occurred while saving user account!"
                        })
                    })
                })
                .catch(err => {
                    res.json({
                        status: "failed",
                        message: "An error occurred while hashing password!"
                    })
                })
            }

        })
        .catch (err => {
            console.log(err);
            res.json({
                status: "failed",
                message: "An error occured while checking for existing user!"
            })
        })
    }
})
//SignIn
router.post('/signin', (req, res) => {
    let {email, password} = req.body;
    email = email.trim();
    password = password.trim();
    
    if(email == "" || password == ""){
        res.json({
            status: "failed",
            message: "Empty credentials supplied"
        })
    } else {
        User.find({email})
        .then(data => {
            if(data){
                //user exists
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if(result) {
                        //create JWTs
                        const accessToken = jwt.sign(
                            {"email": User.email},
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn: '8h'}
                        )
                        //password match
                        res.json({
                            status: "Success",
                            message: "Signin successful",
                            accessToken
                        })
                    } else {
                        res.json({
                            status: "failed",
                            message: "Invalid password entered!"
                        })
                    }
                })
                .catch(err => {
                    res.json({
                        status: "failed",
                        message: "An error occurred while comparing passwords"
                    })
                })
            } else {
                res.json({
                    status: "failed",
                    message: "Invalid credentials entered!"
                })
            }
        })
        .catch(err => {
            res.json({
                status: "failed",
                message: "An error occurred while checking for existing for user"
            })
        })
    }
})


router.get("/", verifyJWT, (req, res) => {
    console.log(req.email);
    return res.send("Hi")
});

module.exports = router;