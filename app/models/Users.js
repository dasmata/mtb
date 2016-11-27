var DataTypes = require("sequelize").DataTypes;
var passwordHash = require('password-hash');

module.exports = function(sequelize){
    "use strict";
    return sequelize.define('Users', {
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(500),
            allowNull: false,
            set: function(value){
                var hashedPassword = passwordHash.generate('password123', {algorithm: "sha512", saltLength: 20, iterations : 8});
                this.setDataValue('password', hashedPassword);
            }
        },
        role: DataTypes.INTEGER.UNSIGNED
    });
};
