const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
var passport = require("passport");
// var dotenv = require('dotenv')
// import strategy from "passport-facebook";


// const FacebookStrategy = strategy.Strategy;


// User Model
const User = require('../../models/User');

// @route   POST api/auth
// @desc    Auth user
// @access  Public
router.post('/', (req, res) => {
  const { email, password } = req.body;

  console.log(email, password)
  // Simple validation
  if(!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Check for existing user
  User.findOne({ email :email })
    .then(user => {
      if(!user) return res.status(400).json({ msg: 'User Does not exist' });

      // Validate password
      console.log("user password", user.password)
      console.log(password)
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

          jwt.sign(
            { id: user.id },
            'jwtSecret',
            { expiresIn:10000 },
            (err, token) => {
              if(err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                //   method : user.method,
                  firstName:user.firstName,
                  lastName:user.lastName,
                  email:user.email,
                  companyName:user.companyName,
                  companyType:user.companyType,
                  industry:user.industry,
                  country  :user.country,
                  date :user.local.date
                }
              });
            }
          )
        })
    })   .catch(e => {
      res.redirect("/");
      console.log(e);
    });
});


module.exports = router;