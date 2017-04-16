"use strict";

var BetweenValidator = require("./Between");

/**
 * Validates the length of a value
 */
class Length extends BetweenValidator {

    /**
     * the constructor of the class
     *
     * @param {object} options the instance's options
     */
    constructor(options) {
        super(options);
        this.message = "Invalid value";
    }

    /**
     * @inheritdoc
     */
    validate(value) {
        return super.validate(value.length);
    }

}

module.exports = Length;
