"use strict";

var models = function (sequelize) {
    var models = {
        "Orders": require("./Orders.js")(sequelize),
        "Users": require("./Users.js")(sequelize),
        "Bikes": require("./Bikes.js")(sequelize),
        "Reservations": require("./Reservations.js")(sequelize),
        "Services": require("./Services.js")(sequelize),
        "Products": require("./Products.js")(sequelize),
        "AccessTokens": require("./AccessTokens.js")(sequelize),
    };
    models.Orders.belongsTo(models.Users, {
        "targetKey": "uuid",
        "as": "client",
        "foreignKey": "ClientUuid"
    });
    models.Orders.belongsTo(models.Users, {
        "as": "responsible",
        "targetKey": "uuid",
        "foreignKey": "ResponsibleUuid"
    });
    models.Orders.belongsToMany(models.Products, {
        through: "OrderProducts",
        as: "products"
    });

    models.Products.hasMany(models.Services, {
        as: "services"
    });
    models.Products.belongsToMany(models.Orders, {
        through: "OrderProducts"
    });

    models.Products.belongsToMany(models.Services, {
        as: 'Services',
        through: 'ProductsServices',
        foreignKey: 'productId'
    });
    models.Services.belongsToMany(models.Products, {
        as: 'Products',
        through: 'ProductsServices',
        foreignKey: 'serviceId'
    });

    models.AccessTokens.belongsTo(models.Users, {
        as: "User",
        targetKey: "uuid",
        foreignKey: "UserUuid"
    });

    models.Users.hasOne(models.AccessTokens, {
        as: "AccessToken"
    });

    models.Users.hasMany(models.Reservations, {
        as: "reservations"
    });
    models.Reservations.belongsTo(models.Users, {
        as: "User",
        targetKey: "uuid",
        foreignKey: "UserUuid"
    });
    models.Reservations.belongsTo(models.Bikes, {
        as: "Bike",
        tagetKey: "uuid",
        foreignKey: "BikeUuid"
    });
    models.Users.hasMany(models.Bikes, {
        as: "bikes"
    });
    models.Bikes.belongsTo(models.Users, {
        as: "User",
        foreignKey: "UserUuid",
        targetKey: "uuid"
    });
    models.Bikes.hasMany(models.Reservations, {
        as: "reservations"
    });

    return models;
};


module.exports = models;