"use strict";
var checkAuth = function(req){
    return typeof req.session !== "undefined" && typeof req.session.passport !== "undefined" && typeof  req.session.passport.user !== "undefined";
};

var sendNotAuthorized = function(res){
    res.status(403);
    res.send("https://www.youtube.com/watch?v=mJZZNHekEQw");
};

var isAuth = function(){
    return function (req, res, next) {
        if(checkAuth(req)){
            next();
        } else {
            sendNotAuthorized(res);
        }
    }
};

var hasRole = function(role){
    return function(req, res, next){
        if(checkAuth(req) && (req.session.passport.user.role & role)){
            next();
        } else {
            sendNotAuthorized(res);
        }
    }
};

module.exports = {
    isAuth: isAuth,
    hasRole: hasRole,
    ROLE_ANON: 1,
    ROLE_CLIENT: 2,
    ROLE_EMPLOYEE: 4,
    ROLE_ADMIN: 8
};