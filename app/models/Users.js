"use strict";

var DataTypes = require("sequelize").DataTypes;
var passwordHash = require('password-hash');

module.exports = function (sequelize) {
    var model = sequelize.define('Users', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(500),
            allowNull: false,
            set: function (value) {
                var hashedPassword = passwordHash.generate(value, {algorithm: "sha512", saltLength: 20, iterations: 8});
                this.setDataValue('password', hashedPassword);
            }
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        role: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 2
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['username']
            }
        ],
        instanceMethods: {
            validPassword: function (password) {
                return passwordHash.verify(password, this.get("password"));
            }
        }
    });

    return model;
};
