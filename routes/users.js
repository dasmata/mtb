var express = require('express');
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
      return done(null, {"id": 1});
      // User.findOne({ username: username }, function (err, user) {
      //   if (err) { return done(err); }
      //   if (!user) {
      //     return done(null, false, { message: 'Incorrect username.' });
      //   }
      //   if (!user.validPassword(password)) {
      //     return done(null, false, { message: 'Incorrect password.' });
      //   }
      //   return done(null, user);
      // });
    }
));


/* GET users listing. */
router.post('/', passport.authenticate('local'), function(req, res){
  console.log("passport user", req.user);
  res.redirect("/");
});

router.put('/', function(req, res){
  req.app.get("db").Users.create({
    "username": "test",
    "password": "123456",
    "role": 31
  }).then(function(usr){
    "use strict";
    console.log(usr.get("username"));
    console.log(usr.get("password"));
  });
  res.redirect("/");
});



module.exports = router;
