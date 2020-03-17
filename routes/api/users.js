const express = require("express");
const router = express.Router();


const User = require("../../models/User");
// @route   GET api/users
// @desc    list all user
// @access  Public

router.get("/", (req, res) => {
    User.find()
      // .sort({date : -1})
      .then(users => res.json(users));
  });


module.exports = router;