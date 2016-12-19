"use strict";
import User from "../Models/User";
import OrderProducts from "../Collections/OrderProducts";
require("backbone-nested-models");

var Order = Backbone.Model.extend({
  "urlRoot": "/api/products",
  "relations":{
    "User": User,
    "OrderProducts": OrderProducts
  },
  "schema": {
    "User": {
      type: 'NestedModel',
      model: User
    },
    "totalValue": {
      type: "Text",
      validate: [
        "float",
        {
          name: "between",
          params: {min: 0}
        }
      ]
    },
    "OrderProducts": {
      type: "ModelsList",
      collection: OrderProducts,
      validate: [
        "notEmpty",
        {
          name: "length",
          params: {min: 1}
        }
      ]
    }
  }
});

export default Order;