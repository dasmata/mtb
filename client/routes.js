"use strict";

const ROLES = require("./roles");

module.exports = [
    {
        "path": "",
        "activity": "Homepage",
        "name": "homepage",
        "middlewares": [
            {
                name: "acl",
                params: {allow: [ROLES.CLIENT]}
            }
        ]
    },
    {
        "path": "login",
        "activity": "Auth",
        "name": "login"
    },
    {
        "path": "logout",
        "activity": "Auth",
        "name": "logout",
        "middlewares": [
            {
                name: "acl",
                params: {allow: [ROLES.CLIENT, ROLES.EMPLOYEE, ROLES.ADMIN]}
            }
        ]
    },
    {
        "path": "users",
        "activity": "Users",
        "name": "users.list",
        "middlewares": [
            {
                name: "acl",
                params: {allow: [ROLES.EMPLOYEE, ROLES.ADMIN]}
            }
        ]
    },
    {
        "path": "dashboard",
        "activity": "Dashboard",
        "name": "admin.dashboard",
        "middlewares": [
            {
                name: "acl",
                params: {allow: [ROLES.ADMIN]}
            }
        ]
    }
];
