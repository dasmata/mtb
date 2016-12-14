"use strict";
import UsersCollection from "../Collections/Users";
import User from "../Models/User";
import GridUUIDFormatter from "../../Formatter/UUID";
import GridView from "./Grid";
import RegisterService from "../../Service/Register";

import SelectAllHeaderCell from "backgrid-select-all";


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
      "formatter": GridUUIDFormatter
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
  "serviceClass": RegisterService,
  "initialize": function(){
    GridView.prototype.initialize.call(this);
  }
});

export default View;
