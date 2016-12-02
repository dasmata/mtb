var express = require('express');
var router = express.Router();
var passport = require("passport");

/* GET users listing. */
router.post('/', passport.authenticate('local'), function(req, res){
  res.redirect("/");
});

router.put('/:username', passport.authenticate('local'), function(req, res){
  res.status(204);
  res.send();
});

module.exports = router;
