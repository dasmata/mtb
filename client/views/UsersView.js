"use strict";

var UUIDFormatter = require("../formatter/UUIDFormatter");
var GridView = require("./GridView");

/**
 * Employees grid view
 * @type {Backbone.View}
 */
module.exports = GridView.extend({
    tagName: "div",
    entityName: "User",
    columnsConfig: [
        {
            "name": "uuid",
            "label": "ID",
            "editable": false,
            "cell": "string",
            "formatter": UUIDFormatter
        },
        {
            "name": "username",
            "label": "Username",
            "editable": false,
            "cell": "string"
        },
        {
            "name": "phone",
            "label": "Phone",
            "editable": false,
            "cell": "string"
        }
    ]
});
