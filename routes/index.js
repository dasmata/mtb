"use strict";
var express = require('express');
var router = express.Router();
var acl = require("../app/acl.js");

router.get('/user-menu', acl.isAuth(), function (req, res, _next) {
    res.json(acl.getMenu(req.user.get("role")));
});

/* GET home page. */
router.get('/*', function (req, res, _next) {
    res.render('index', {title: 'Express'});
});

module.exports = router;
