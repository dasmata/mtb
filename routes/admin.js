var express = require('express');
var router = express.Router();
var acl = require("../app/acl.js");

/* GET users listing. */
router.get('/', acl.hasRole(acl.ROLE_ADMIN), function(req, res){
    res.render("admin/dashboard", {});
});

module.exports = router;

