"use strict";

var Sequelize = require("sequelize");
var DataTypes = require("sequelize").DataTypes;

module.exports = function (sequelize) {
    return sequelize.define('Bikes', {
        uuid: {
            type: Sequelize.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        UserUuid:{
            type: Sequelize.UUID,
            allowNull: false
        }
    });
};
