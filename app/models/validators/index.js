"use strict";
let validators = require("../../../client/validator");


let validate = function (constructor) {
    let obj = new constructor();
    return function (value) {
        if (!obj.validate(value)) {
            throw new Error(obj.getMessage());
        }
    };
};

module.exports = {
    isEmail: validate(validators.email),
    isPhone: validate(validators.phone)
};
