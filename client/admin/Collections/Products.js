"use strict";
import Product from "../Models/Product";
import GridCollection from "./GridCollection";

var Products = GridCollection.extend({
  "url": "/api/products",
  "model": Product
});


export default Products;
