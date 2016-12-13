"use strict";
var checkAuth = function (req) {
  return typeof req.session !== "undefined" && typeof req.session.passport !== "undefined" && typeof  req.session.passport.user !== "undefined";
};

var sendNotAuthorized = function (res) {
  res.status(403);
  res.send("https://www.youtube.com/watch?v=mJZZNHekEQw");
};

var isAuth = function () {
  return function (req, res, next) {
    if (checkAuth(req)) {
      next();
    } else {
      sendNotAuthorized(res);
    }
  }
};

var hasRole = function (role) {
  return function (req, res, next) {
    if (checkAuth(req) && (req.session.passport.user.role & role)) {
      next();
    } else {
      sendNotAuthorized(res);
    }
  }
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
  }
})();

function addAdminMenu(menu){
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

function addEmployeeMenu(menu){
  menu.push({
    "label": "Orders",
    "url": "/admin/orders"
  });
  menu.push({
    "label": "Clients",
    "url": "/admin/clients"
  });
}

var getMenu = function (role) {
  if(isNaN(role)){
    return;
  }
  var menu = [];
  if(role & Acl.ROLE_ADMIN){
    addAdminMenu(menu);
  }
  if(role & Acl.ROLE_EMPLOYEE){
    addEmployeeMenu(menu);
  }
  return menu;
};

var apiAuth = function(role) {
  return function(req, res, context){
    if (checkAuth(req) && (req.session.passport.user.role & role)) {
      return context.continue();
    } else {
      sendNotAuthorized(res);
    }
  }
};

var apiMidleware = function(roles){
  return {
    "create": {auth: apiAuth(roles.create)},
    "list": {auth: apiAuth(roles.list)},
    "read": {auth: apiAuth(roles.read)},
    "update": {auth: apiAuth(roles.update)},
    "delete": {auth: apiAuth(roles.delete)}
  }
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