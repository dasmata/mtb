"use strict";
import UsersCollection from "../Collections/Users";
import User from "../Models/User";
import UUIDFormatter from "../../Formatter/UUID";
import GridView from "./Grid";

import SelectAllHeaderCell from "backgrid-select-all";
import BackbonePaginator from "backbone.paginator";


var View = GridView.extend({
  "columns": [
    {
      name: "",
      cell: "select-row",
      headerCell: "select-all"
    },
    {
      "name": "uuid",
      "label": "ID",
      "editable": false,
      "cell": "string",
      // "formatter": $.extend({}, Backgrid.CellFormatter.prototype, {
      //   "fromRaw" : UUIDFormatter.prototype.fromRaw
      // })
    },
    {
      "name": "username",
      "label": "Utilizator",
      "editable": false,
      "cell": "string"
    },
    {
      "name": "phone",
      "label": "Telefon",
      "editable": true,
      "cell": "string"
    }
  ],
  "entityName": "user",
  "collection": UsersCollection,
  "model": User,
  "initialize": function(){
    GridView.prototype.initialize.call(this);
  }
});

export default View;
