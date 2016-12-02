"use strict";
import User from "../Models/Users.js";
import $ from "jquery";

window.security = (function(){
    var identity;
    var service = {
        isAuth(){
            return typeof identity !== "undefined" && identity instanceof User;
        },

        get identity(){
            return identity;
        }
    };
    $(document).on("authenticate", function(e, model){
        identity = model;
    });
    service.constructor = function Security(){};
    return service;

})();
