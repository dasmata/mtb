"use strict";
import ProductsCollection from "../Collections/Products";
import Product from "../Models/Product";
import GridView from "./Grid";

var View = GridView.extend({
  "columns": [
    {
      "name": "",
      "cell": "select-row",
      "headerCell": "select-all"
    },
    {
      "name": "id",
      "label": "ID",
      "editable": false,
      "cell": "string"
    },
    {
      "name": "name",
      "label": "Name",
      "editable": false,
      "cell": "string"
    },
    {
      "name": "price",
      "label": "Price",
      "editable": true,
      "cell": "string"
    }
  ],
  "entityName": "product",
  "collection": ProductsCollection,
  "model": Product
});

export default View;
