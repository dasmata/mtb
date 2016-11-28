var Sequelize = require("sequelize");

module.exports = function(sequelize){
    "use strict";
    return sequelize.define('Orders', {
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        status: Sequelize.INTEGER
    });
};