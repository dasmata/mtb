var express = require('express');
var router = express.Router();
var acl = require("../app/acl.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/user-menu', acl.isAuth(), function(req, res, next) {
  res.json(acl.getMenu(req.session.passport.user.role));
});

module.exports = router;
