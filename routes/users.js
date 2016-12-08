"use strict";

var express = require('express');
var router = express.Router();
var passport = require("passport");
var acl = require("../app/acl");
// var UsersService = require("../Services/Users");

/* GET users listing. */
router.post('/:username', function(req, res){
  var userdata = {
    "username": req.body.username,
    "password": req.body.password,
    "phone": req.body.phone
  };
  req.app.get("db").Users.findOne({
    "where": {"username": userdata.username}
  }).then(function(data){
    if(data === null){
      return req.app.get("db").Users.create(userdata)
        .then(function(){
          res.sendStatus(204);
        });
    }
    return res.sendStatus(400);
  });
});

router.put('/:username', passport.authenticate('local'), function(req, res){
  res.sendStatus(204);
});

router.delete('/:username', acl.isAuth(), function(req, res){
  req.logout();
  res.sendStatus(204);
});

router.get('/check/:username', function(req, res){
  var usr;
  req.app.get("db").Users.findOne({
    "where": {"username": req.params.username}
  }).then(function(data){
    if(data === null){
      return res.sendStatus(404);
    }
    usr = {
      uui: "********-****-****-****-****" + data.get("uuid").substring(data.get("uuid").length - 4, data.get("uuid").length),
      username:data.get("username"),
      createdAt:data.get("createdAt"),
      updatedAt:data.get("updatedAt")
    };
    res.json(usr);
  });
});

module.exports = router;