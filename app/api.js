"use strict";
var acl = require("./acl");
var epilogue = require('epilogue');


module.exports = function (app, sequelize) {
  var models = app.get("db");
  epilogue.initialize({
    app: app,
    base: "/api",
    sequelize: sequelize,
  });

  var resourcesAcl = {
    "users": {
      "create": acl.ROLE_EMPLOYEE,
      "list": acl.ROLE_EMPLOYEE,
      "read": acl.ROLE_EMPLOYEE,
      "update": acl.ROLE_ADMIN,
      "delete": acl.ROLE_ADMIN
    },
    "orders": {
      "create": acl.ROLE_CLIENT,
      "list": acl.ROLE_CLIENT,
      "read": acl.ROLE_CLIENT,
      "update": acl.ROLE_CLIENT,
      "delete": acl.ROLE_CLIENT
    },
    "default": {
      "create": acl.ROLE_ANON,
      "list": acl.ROLE_ANON,
      "read": acl.ROLE_ANON,
      "update": acl.ROLE_ANON,
      "delete": acl.ROLE_ANON
    }
  };

  var resources = {
    users : epilogue.resource({
      model: models.Users,
      endpoints: ['/users', '/users/:uuid'],
      excludeAttributes: ["password"]
    }),

    orders : epilogue.resource({
      model: models.Orders,
      endpoints: ['/orders', '/orders/:uuid'],
      associations: [models.Products]
    }),

    products : epilogue.resource({
      model: models.Products,
      endpoints: ['/products', '/products/:id']
    }),

    services : epilogue.resource({
      model: models.Services,
      endpoints: ['/services', '/services/:id']
    })
  };

  Object.keys(resources).forEach(function(key, index){
    var entityAcl = resourcesAcl[key] || {};
    resources[key].use(acl.apiMidleware(Object.assign({}, resourcesAcl.default, entityAcl)));
  });

};
