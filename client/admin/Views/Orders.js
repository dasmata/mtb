"use strict";
import Orders from "../Collections/Orders";
import Order from "../Models/Order";
import GridView from "./Grid";

var View = GridView.extend({
  get columns(){
    return [
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
        "name": "User",
        "label": "User",
        "editable": false,
        "cell": "string"
      },
      {
        "name": "totalValue",
        "label": "TotalValue",
        "editable": true,
        "cell": "string"
      }
    ]
  },
  "entityName": "order",
  "collection": Orders,
  "model": Order
});

export default View;
