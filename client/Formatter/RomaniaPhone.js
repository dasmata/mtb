"use strict";
import Backgrid from "backgrid";

import PhoneValidator from "../Validator/Phone";
import NotEmptyValidator from "../Validator/NotEmpty";

class RomaniaPhone{

  fromRaw(value){
    value = value.replace(/\(|\)|\.|\s|^0/g, "");
    var notEmpty = new NotEmptyValidator();
    if(!this.checkFormat(value) && notEmpty.validate(value)){
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