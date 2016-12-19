"use strict";
import Order from "../Models/Order";
import GridCollection from "./GridCollection";

var Orders = GridCollection.extend({
  "url": "/api/orders",
  "model": Order
});


export default Orders;
