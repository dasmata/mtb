"use strict";

var DataTypes = require("sequelize").DataTypes;

module.exports = function(sequelize){
    return sequelize.define('AccessToken', {
        token: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        expires: {
            type: DataTypes.DATEONLY,
            defaultValue: null
        },
        UserUuid: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, {
        indexes: [
            {
                fields: ["expires", "UserUuid"]
            }
        ]
    });
};