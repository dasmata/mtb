var isAuth = function(){
    return function (req, res, next) {
        console.log(req.session.passport);
        console.log(typeof req.session !== "undefined" && typeof req.session.passport !== "undefined" && typeof  req.session.passport.user !== "undefined")
        if(typeof req.session !== "undefined" && typeof req.session.passport !== "undefined" && typeof  req.session.passport.user !== "undefined"){
            req.identity = req.session.passport.user;
            next();
        } else {
            res.status(403);
            res.send("https://www.youtube.com/watch?v=mJZZNHekEQw");
        }
    }
};

var isRole = function(role){
    return function(req, res, next){
        "use strict";
        return true;
    }
};

module.exports = {
    isAuth: isAuth,
    isRole: isRole
};