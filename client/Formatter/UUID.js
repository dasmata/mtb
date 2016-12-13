"use strict";
import Backgrid from "backgrid";

class UUIDFormatter{

  fromRaw(value){
    return value.substr(0,4) + "..." + value.substr(value.length - 4, value.length);
  }

}

export default $.extend({}, Backgrid.CellFormatter.prototype, {
   "fromRaw" : UUIDFormatter.prototype.fromRaw,

});
