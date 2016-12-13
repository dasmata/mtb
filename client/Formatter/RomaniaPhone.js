"use strict";
import Backgrid from "backgrid";

import PhoneValidator from "../Validator/Phone";

class RomaniaPhone{

  fromRaw(value){
    value = value.replace(/\(|\)|\.|\s|^0/g, "");
    if(!this.checkFormat(value)){
      return "+40" + value;
    }
    return value;
  }

  toRaw(value){
    return value;
  }

  checkFormat(value){
    var validator = new PhoneValidator();
    return validator.validate(value);
  }

}

export default $.extend({}, Backgrid.CellFormatter.prototype, {
  "fromRaw" : RomaniaPhone.prototype.fromRaw,
  "toRaw" : RomaniaPhone.prototype.toRaw,
  "checkFormat" : RomaniaPhone.prototype.checkFormat
});