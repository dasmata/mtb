"use strict";

var models = function(sequelize){
    return {
        "Orders": require("./Orders.js")(sequelize),
        "Users": require("./Users.js")(sequelize)
    };
};


module.exports = models;