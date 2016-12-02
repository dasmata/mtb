"use strict";
var epilogue = require('epilogue');

module.exports = function(app, sequelize){
    var models = app.get("db");
    epilogue.initialize({
        app: app,
        base: "/api",
        sequelize: sequelize
    });

    var userResource = epilogue.resource({
        model: models.Users,
        endpoints: ['/users', '/users/:uuid'],
        excludeAttributes: ["password"]
    });

    var orderResource = epilogue.resource({
        model: models.Orders,
        endpoints: ['/orders', '/orders/:uuid'],
        associations: [models.Products]
    });

    var productsResource = epilogue.resource({
        model: models.Products,
        endpoints: ['/products', '/products/:id']
    });

    var servicesResource = epilogue.resource({
        model: models.Services,
        endpoints: ['/services', '/services/:id']
    });
};
