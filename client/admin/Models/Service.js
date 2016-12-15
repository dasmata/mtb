"use strict";

var Service = Backbone.Model.extend({
  "urlRoot": "/api/services",
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
    }
  }
});

export default Service;
