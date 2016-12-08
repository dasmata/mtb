"use strict";
var local = require("./config.local.js");

module.exports = {
  "development": {
    "client_js": "http://127.0.0.1:8080/js/",
    "database": local
  },
  "production": {
    "client_js": "http://127.0.0.1:8080/js/",
    "database": local
  }
};
