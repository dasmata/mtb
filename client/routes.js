"use strict";

module.exports = [
    {
        "path": "",
        "activity": "Auth",
        "name": "login",
        "middlewares": ["acl"]
    },
    {
        "path": "logout",
        "activity": "Auth",
        "name": "logout",
        "middlewares": ["acl"]
    }
];
