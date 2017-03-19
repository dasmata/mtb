"use strict";
var Sequelize = require("sequelize");
var DataTypes = require("sequelize").DataTypes;

module.exports = function(sequelize){
    return sequelize.define('Orders', {
        uuid: {
            type: Sequelize.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        status: Sequelize.INTEGER
    });
};