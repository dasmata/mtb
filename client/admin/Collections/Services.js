"use strict";
import Service from "../Models/Service";
import GridCollection from "./GridCollection";

var Services = GridCollection.extend({
  "url": "/api/services",
  "model": Service
});


export default Services;
