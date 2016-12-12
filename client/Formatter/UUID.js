"use strict";

class UUIDFormatter{

  fromRaw(value){
    return value.substr(0,4) + "..." + value.substr(value.length - 4, value.length);
  }

}

export default UUIDFormatter;
