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
    if (checkAuth(req)) {
      req.app.locals.user = req.session.passport.user;
      delete req.app.locals.user.password;
    } else {
      req.app.locals.user = null;
    }
    next();
  }
})();

module.exports = {
  isAuth: isAuth,
  hasRole: hasRole,
  setUser: setUser,
  ROLE_ANON: 1,
  ROLE_CLIENT: 2,
  ROLE_EMPLOYEE: 4,
  ROLE_ADMIN: 8
};