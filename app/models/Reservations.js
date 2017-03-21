"use strict";

var Sequelize = require("sequelize");
var DataTypes = require("sequelize").DataTypes;

module.exports = function (sequelize) {
    return sequelize.define('Reservations', {
        uuid: {
            type: Sequelize.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        UserUuid:{
            type: Sequelize.UUID,
            allowNull: false
        },
        BikeUuid:{
            type: Sequelize.UUID,
            allowNull: false
        }
    }, {
        indexes: [
            {fields: ["date"]}
        ]
    });
};
