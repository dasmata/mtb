"use strict";

var express = require('express');
var router = express.Router();
var acl = require("../app/acl");
var moment = require("moment");
// var UsersService = require("../Services/Users");

/* GET users listing. */
router.post('/:username', function (req, res) {
    var userdata = {
        "username": req.body.username,
        "password": req.body.password,
        "phone": req.body.phone
    };
    req.app.get("db").Users.findOne({
        "where": {"username": userdata.username}
    }).then(function (data) {
        if (data === null) {
            return req.app.get("db").Users.create(userdata)
                .then(function () {
                    res.sendStatus(204);
                });
        }
        return res.sendStatus(400);
    });
});

router.put('/:username', function (req, res) {
    var models = req.app.get("db");
    var foundUser = null;
    models.Users.findOne({
        where: {
            username: req.body.username
        }
    }).then(function (user) {
        if (!user) {
            res.status(401).send("");
        }
        foundUser = user;
        return req.app.get("db").AccessTokens.findOrCreate({
            where: {
                "UserUuid": user.uuid,
                "expires": {
                    "gt": moment().format("YYYY-MM-DD")
                }
            },
            defaults: {
                expires: moment().add(365, "days").format("YYYY-MM-DD")
            }
        });
    }).spread(function (token) {
        var user = foundUser.toJSON();
        delete user.password;
        delete user.createdAt;
        delete user.updatedAt;
        res.set("X-Access-Token", token.get("token"));
        res.status(201).send(user);
    });
});

router.delete('/:username', acl.isAuth(), function (req, res) {
    req.logout();
    res.sendStatus(204);
});

router.get('/check/:username', function (req, res) {
    var usr;
    req.app.get("db").Users.findOne({
        "where": {"username": req.params.username}
    }).then(function (data) {
        if (data === null) {
            return res.sendStatus(404);
        }
        usr = {
            uui: "********-****-****-****-****" + data.get("uuid").substring(data.get("uuid").length - 4, data.get("uuid").length),
            username: data.get("username"),
            createdAt: data.get("createdAt"),
            updatedAt: data.get("updatedAt")
        };
        res.json(usr);
    });
});

module.exports = router;