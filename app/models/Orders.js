var Sequelize = require("sequelize");

module.exports = function(sequelize){
    "use strict";
    return sequelize.define('Orders', {
        status: Sequelize.INTEGER
    });
};