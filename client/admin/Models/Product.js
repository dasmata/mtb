"use strict";
import Services from "../Collections/Services";
require("backbone-nested-models");

var Product = Backbone.Model.extend({
  "urlRoot": "/api/products",
  "relations":{
    "Services": Services
  },
  "schema": {
    "name": {
      type: "Text",
      validate: [
        "notEmpty",
        {
          name: "length",
          params: {min: 2, max: 255}
        }
      ]
    },
    "price": {
      type: "Text",
      validate: [
        "float",
        {
          name: "between",
          params: {min: 0}
        }
      ]
    },
    "description": {
      type: "TextArea"
    },
    "Services": {
      type: "ModelsList",
      collection: Services,
      validate: [
        "notEmpty",
        {
          name: "length",
          params: {min: 1}
        }
      ]
    }
  },
  toString: function(){
    return this.get("name");
  }
});

export default Product;