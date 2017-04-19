"use strict";

let express = require('express');
let router = express.Router();
let acl = require("../app/acl");
let moment = require("moment");
// var UsersService = require("../Services/Users");


router.put("/", function (req, res) {
    req.app.get("db").Users.findOne({
        "where": {"activation_token": (req.body.activation_key || 'invalidKey')}
    }).then(function(user){
        if(!user){
            return user;
        }
        user.set("password", req.body.password);
        user.set("activation_token", null);
        user.save();
    }).then(function(){
        res.sendStatus(204);
    });
});

/* GET users listing. */
router.post('/:username', function (req, res) {
    let userdata = {
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
    let models = req.app.get("db");
    let foundUser = null;
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
        let user = foundUser.toJSON();
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
    let usr;
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