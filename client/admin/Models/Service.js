"use strict";

var Service = Backbone.Model.extend({
  "urlRoot": "/api/services",
  "schema": {
    "name": {
      type: "Text",
    },
    "price": {
      type: "Text"
    }
  }
});

export default Service;
