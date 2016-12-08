var express = require('express');
var router = express.Router();
var passport = require("passport");
var acl = require("../app/acl");

/* GET users listing. */
router.post('/:username', function(req, res){
  res.sendStatus(204);
});

router.put('/:username', passport.authenticate('local'), function(req, res){
  res.sendStatus(204);
});

router.delete('/:username', acl.isAuth(), function(req, res){
  req.logout();
  res.sendStatus(204);
});

module.exports = router;
