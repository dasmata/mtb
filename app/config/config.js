"use strict";
var local = require("./config.local.js");

var cfg = {
    "development": {
        "client_js": "http://127.0.0.1:8080/js/",
        "database": local.database,
        "google": local.google,
        "mailgun": local.mailgun,
        "baseUrl": local.baseUrl
    }
};

cfg.production = Object.assign({}, cfg.development, {
    client_js: "/"
});


module.exports = cfg;