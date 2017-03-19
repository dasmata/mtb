

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

    products : epilogue.resource({
      model: models.Products,
      endpoints: ['/products', '/products/:id'],
      associations: [models.Services]
    }),

    orders : epilogue.resource({
      model: models.Orders,
      endpoints: ['/orders', '/orders/:uuid'],
      associations: [models.Products]
    }),

    services : epilogue.resource({
      model: models.Services,
      endpoints: ['/services', '/services/:id']
    })
  };

  var saveRelations = function(req, res, context){
    var deeds = [];
    this.include.forEach(function(include){
      var method = "set" + include.as.charAt(0).toUpperCase() + include.as.slice(1);
      var values = [];
      if(typeof context.instance[method] === "function"){
        if(context.attributes[include.as]){
          context.attributes[include.as].forEach(function(value){
            if(typeof value === "object" && value !== null){
              values.push(include.model.build(value));
            }
          });
          if(values.length > 0){
            deeds.push(context.instance[method](values));
          }
        }
      }
    });
    Promise.all(deeds).then(function(){
      context.continue();
    });
  };

  Object.keys(resources).forEach(function(key, index){
    var entityAcl = resourcesAcl[key] || {};
    resources[key].use(acl.apiMidleware(Object.assign({}, resourcesAcl.default, entityAcl)));
    resources[key].use({
      "update": { write: { after: saveRelations } },
      "create": { write: { after: saveRelations } }
    });
  });

};
