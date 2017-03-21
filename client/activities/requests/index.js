"use strict";
var importedRequests = {
    Login : require("./Login")
};

module.exports = {
    createActivityRequest: function(name, params){
        return new importedRequests[name](params || {});
    }
};
