"use strict";
var checkAuth = function (req) {
    return typeof req.session !== "undefined" && typeof req.session.passport !== "undefined" && typeof  req.session.passport.user !== "undefined";
};

var sendNotAuthorized = function (res) {
    res.status(401);
    res.send("https://www.youtube.com/watch?v=mJZZNHekEQw");
};

var isAuth = function () {
    return function (req, res, next) {
        if (checkAuth(req)) {
            next();
        } else {
            sendNotAuthorized(res);
        }
    };
};

var hasRole = function (role) {
    return function (req, res, next) {
        if (checkAuth(req) && (req.session.passport.user.role & role)) {
            next();
        } else if (Acl.ROLE_ANON & role) {
            next();
        } else {
            sendNotAuthorized(res);
        }
    };
};

var setUser = (function () {
    return function (req, res, next) {
        var uuid;
        if (checkAuth(req)) {
            req.app.locals.user = Object.assign({}, req.session.passport.user);
            req.app.locals.menu = getMenu(req.session.passport.user.role);
            delete req.app.locals.user.password;
            delete req.app.locals.user.role;
            uuid = req.session.passport.user.uuid;
            req.app.locals.user.uuid = "********-****-****-****-****" + uuid.substring(uuid.length - 4, uuid.length);
        } else {
            req.app.locals.user = null;
            req.app.locals.menu = null;
        }
        next();
    };
})();

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

var apiAuth = function (role) {
    return function (req, res, context) {
        var models = req.app.get("db");
        new Promise(function (done) {
            var accessToken = req.header("X-Access-Token") || req.header("x-acces-token");
            if (!accessToken) {
                done(null);
            } else {
                done(accessToken);
            }
        }).then(function (token) {
            if(!token){
                return null;
            }
            return models.AccessTokens.findById(
                token,
                {include: {model: models.Users, as: "User"}}
            );
        }).then(function (token) {
            var userRole = !token ? Acl.ROLE_ANON : token.User.role;
            if (userRole & role) {
                return context.continue();
            }
            sendNotAuthorized(res);
        });
    };
};

var apiMidleware = function (roles) {
    return {
        "create": {auth: apiAuth(roles.create)},
        "list": {auth: apiAuth(roles.list)},
        "read": {auth: apiAuth(roles.read)},
        "update": {auth: apiAuth(roles.update)},
        "delete": {auth: apiAuth(roles.delete)}
    };
};

var Acl = {
    isAuth: isAuth,
    hasRole: hasRole,
    setUser: setUser,
    getMenu: getMenu,
    apiMidleware: apiMidleware,
    ROLE_ANON: 1,
    ROLE_CLIENT: 2,
    ROLE_EMPLOYEE: 4,
    ROLE_ADMIN: 8
};

module.exports = Acl;