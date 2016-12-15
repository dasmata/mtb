"use strict";

var Service = Backbone.Model.extend({
  "urlRoot": "/api/services",
  "schema": {
    "name": {
      type: "Text",
    },
    "price": {
      type: "Text"
    },
    "description": {
      type: "TextArea"
    }
  }
});

export default Service;
