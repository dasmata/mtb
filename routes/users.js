var express = require('express');
var router = express.Router();
var passport = require("passport");

/* GET users listing. */
router.post('/', passport.authenticate('local'), function(req, res){
  res.redirect("/");
});

module.exports = router;
