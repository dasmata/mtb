"use strict";

var express = require('express');
var router = express.Router();
var acl = require("../app/acl.js");
var http = require("http");
var https = require("https");
var fs = require('fs');
var GoogleApi = require('../app/google/Api');

function parseUri(str) {
    var o = parseUri.options,
        m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i = 14;

    while (i--) uri[o.key[i]] = m[i] || "";

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
    });

    return uri;
};

parseUri.options = {
    strictMode: false,
    key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
    q: {
        name: "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
};

var getJS = function (url, onResult) {
    var options = {};
    var urlParts = parseUri(url);
    var protocol = urlParts.protocol === "http" ? http : https;

    options.port = urlParts.port;
    options.host = urlParts.host;
    options.path = urlParts.path;
    options.method = "GET";

    var req = protocol.request(options, function (res) {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function () {
            onResult(res.statusCode, output);
        });
    });

    req.on('error', function (err) {
        //unhandled
    });

    req.end();
};


router.get('/script.js', acl.hasRole(acl.ROLE_ADMIN), function (req, res) {
    var env = process.env.NODE_ENV || "production";
    if (env !== "production") {
        getJS(req.app.locals.script("admin.js"), function (status, data) {
            res.send(data);
        });
    } else {
        var readStream = fs.createReadStream(__dirname + "/../public/js/admin.js");
        readStream
            .on('data', function (chunk) {
                res.write(chunk)
            })
            .on('end', function () {
                res.end()
            });
    }
});

router.get("/googleoauth", acl.hasRole(acl.ROLE_ADMIN), function (req, res) {
    var api = new GoogleApi(req, res);
    api.authorize(req, res);
});

router.get('/*', acl.hasRole(acl.ROLE_ADMIN), function (req, res) {
    res.render("admin/index", {});
});

module.exports = router;

