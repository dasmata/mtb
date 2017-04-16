"use strict";
var checkAuth = function (req) {
    return apiAuth(req).then(function(token){
        if(token){
            req.user = token.get("User");
        }
    });
};

var sendNotAuthorized = function (res) {
    res.status(401);
    res.send("https://www.youtube.com/watch?v=mJZZNHekEQw");
};

var isAuth = function () {
    return function (req, res, next) {
        checkAuth(req).then(function(){
            if(req.user){
                next();
            } else {
                sendNotAuthorized(res);
            }
        });
    };
};

/**
 * Generates the menu for an admin user
 * @param {Array} menu The menu items
 * @returns {undefined}
 */
function addAdminMenu(menu) {
    menu.push({
        "label": "Admin",
        "children": [
            {
                "label": "Dashboard",
                "url": "/admin"
            },
            {
                "label": "Services",
                "url": "/admin/services"
            },
            {
                "label": "Products",
                "url": "/admin/products"
            },
            {
                "label": "Promotions",
                "url": "/admin/promotions"
            },
            {
                "label": "Users",
                "url": "/admin/users"
            }
        ]
    });
}

/**
 * Generates the menu for an employee
 *
 * @param {Array} menu The menu items
 * @returns {undefined}
 */
function addEmployeeMenu(menu) {
    menu.push({
        "label": "Orders",
        "url": "/admin/orders"
    });
    menu.push({
        "label": "Clients",
        "url": "/admin/users"
    });
}

var getMenu = function (role) {
    if (isNaN(role)) {
        return;
    }
    var menu = [];
    if (role & Acl.ROLE_ADMIN) {
        addAdminMenu(menu);
    }
    if (role & Acl.ROLE_EMPLOYEE) {
        addEmployeeMenu(menu);
    }
    return menu;
};

var apiRole = function (role) {
    return function (req, res, context) {
        return apiAuth(req, res, context).then(function (token) {
            var userRole = !token ? Acl.ROLE_ANON : token.User.role;
            if (userRole & role) {
                return context.continue();
            }
            sendNotAuthorized(res);
        });
    };
};

var apiAuth = function (req) {
    var models = req.app.get("db");
    return new Promise(function (done) {
        var accessToken = req.header("X-Access-Token") || req.header("x-acces-token");
        if (!accessToken) {
            done(null);
        } else {
            done(accessToken);
        }
    }).then(function (token) {
        if (!token) {
            return null;
        }
        return models.AccessTokens.findById(
            token,
            {include: {model: models.Users, as: "User"}}
        );
    });
};

var apiMidleware = function (roles) {
    return {
        "create": {auth: apiRole(roles.create)},
        "list": {auth: apiRole(roles.list)},
        "read": {auth: apiRole(roles.read)},
        "update": {auth: apiRole(roles.update)},
        "delete": {auth: apiRole(roles.delete)}
    };
};

var Acl = {
    isAuth: isAuth,
    getMenu: getMenu,
    apiMidleware: apiMidleware,
    ROLE_ANON: 1,
    ROLE_CLIENT: 2,
    ROLE_EMPLOYEE: 4,
    ROLE_ADMIN: 8
};

module.exports = Acl;