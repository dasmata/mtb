import ServicesCollection from "../Collections/Services";
import Service from "../Models/Service";
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
  "entityName": "service",
  "collection": ServicesCollection,
  "model": Service
});

export default View;