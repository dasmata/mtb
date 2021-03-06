"use strict";

var models = function(sequelize){
    var models =  {
        "Orders": require("./Orders.js")(sequelize),
        "Users": require("./Users.js")(sequelize),
        "Services": require("./Services.js")(sequelize),
        "Products": require("./Products.js")(sequelize)
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

    return models;
};


module.exports = models;