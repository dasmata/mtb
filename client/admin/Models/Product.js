"use strict";

import Services from "../Collections/Services";


Backbone.BootstrapModal = function(){
  this.open = function(){}
  this.on = function(){}
  this.off = function(){}
};

var Product = Backbone.Model.extend({
  "urlRoot": "/api/products",
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
          params: {min: 0}
        }
      ]
    }
  }
});

export default Product;