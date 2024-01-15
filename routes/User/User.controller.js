const express = require('express');
const router = express.Router();

//mongodb
const UserModel = require('./User.model');

//Password handler
const bcrypt = require('bcrypt');

//jwt
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');
const verifyJWT = require('../../middleware/verifyJWT');


//SignUp
router.post('/signup', (req, res) => {
  let { Email, Name, Password } = req.body;
  Email = Email.trim();
  Name = Name.trim();
  Password = Password.trim();

  if (Email == "" || Name == "" || Password == "") {
    res.json({
      status: "failed",
      message: "empty input fields."
    })
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(Email)) {
    res.json({
      status: "failed",
      message: "invalid Email entered."
    })
  } else if (!/^[a-zA-Z]*$/.test(Name)) {
    res.json({
      status: "failed",
      message: "invalid Name entered."
    })
  } else if (Password.length < 8) {
    res.json({
      status: "failed",
      message: "Password is too short."
    })
  } else {
    UserModel.find({ Email }).then(result => {
      if (result.length) {
        //a UserModel already exists
        res.json({
          status: "failed",
          message: "UserModel with the provided Email already exists."
        })
      } else {
        //try to create new UserModel 

        //Password handling 
        const saltRounds = 10;
        bcrypt.hash(Password, saltRounds).then(hashedPassword => {
          const newUser = new UserModel({
            Email,
            Name,
            Password: hashedPassword
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
                message: "An error occurred while saving UserModel account!"
              })
            })
        })
          .catch(err => {
            res.json({
              status: "failed",
              message: "An error occurred while hashing Password!"
            })
          })
      }

    })
      .catch(err => {
        console.log(err);
        res.json({
          status: "failed",
          message: "An error occured while checking for existing UserModel!"
        })
      })
  }
})
//SignIn
router.post('/signin', (req, res) => {
  let { Email, Password } = req.body;
  Email = Email.trim();
  Password = Password.trim();

  if (Email == "" || Password == "") {
    res.json({
      success: false,
      message: "Empty credentials supplied"
    })
  } else {
    UserModel.find({ Email })
      .then(data => {
        if (data) {
          //UserModel exists
          const hashedPassword = data[0].Password;
          bcrypt.compare(Password, hashedPassword).then(result => {
            if (result) {
              //create JWTs
              // const accessToken = jwt.sign(
              //   { "Email": UserModel.Email },
              //   process.env.ACCESS_TOKEN_SECRET,
              //   { expiresIn: '8h' }
              // )
              //Password match
              res.json({
                success: true,
                message: "Signin successful",
                // accessToken
              })
            } else {
              res.json({
                success: false,
                message: "Invalid Password entered!"
              })
            }
          })
            .catch(err => {
              res.json({
                success: false,
                message: "An error occurred while comparing Passwords"
              })
            })
        } else {
          res.json({
            success: false,
            message: "Invalid credentials entered!"
          })
        }
      })
      .catch(err => {
        res.json({
          success: false,
          message: "An error occurred while checking for existing for UserModel"
        })
      })
  }
})


router.get("/", verifyJWT, (req, res) => {
  console.log(req.Email);
  return res.send("Hi")
});

module.exports = router;