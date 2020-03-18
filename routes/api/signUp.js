const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
var passport = require("passport");
const controller = require('../../config/passport') 
// const controller = require('../../config/passport')

// const passportConf  = require('../../config/passport')

// User Model
const User = require("../../models/User");

// const GoogleUser = require("../../models/googleUsers");

// @route   POST api/users
// @desc    Register new user locally
// @access  Public
router.post("/", (req, res) => {
  // if(req.method !== "local" ){
  //   next()
  // }

  const {
    // firstName,
    // lastName,
    email,
    password,
    // companyName,
    // companyType,
    // industry,
    // country
  } = req.body;

  // Simple validation
  if (
    // !firstName ||
    // !lastName ||
    !email ||
    !password 
    // !companyName ||
    // !companyType ||
    // !industry ||
    // !country
  ) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  // Check for existing user
  User.findOne({ email: email }).then(user => {
    if (user) return res.status(400).json({ msg: "User already exists" });

    const newUser = new User({
      local: {
        // firstName,
        // lastName,
        email,
        password,
        // companyName,
        // companyType,
        // industry,
        // country
      }
    });

    // Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.local.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.local.password = hash;
        newUser.save().then(user => {
          jwt.sign(
            { id: user.id },
            "jwtSecret",
            { expiresIn: 10000 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
               
                  // firstName: user.local.firstName,
                  // lastName: user.local.lastName,
                  email: user.local.email,
                  // companyName: user.local.companyName,
                  // companyType: user.local.companyType
                }
              });
            }
          );
        });
      });
    });
  });
});


router.route('/oauth/google')
.post(passport.authenticate('googleToken',  {session : false}),
    controller.googleOauth
)
// router
//   .route("/oauth/google")
//   .post(
//     passport.authenticate("googleToken", { session: false }),
//     controller.googleOauth
//   );

module.exports = router;
