"use strict";

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

export default RomaniaPhone;