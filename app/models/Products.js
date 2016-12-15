var DataTypes = require("sequelize").DataTypes;

module.exports = function(sequelize){
    "use strict";
    return sequelize.define('Products', {
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        }
    });
};