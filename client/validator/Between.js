"use strict";

var AbstractValidator = require("./Abstract");

/**
 * Class that validats ranges
 */
class Between extends AbstractValidator {

    /**
     * Class constructor
     * @param {object} [options] instance options: (min and max)
     */
    constructor(options) {
        super();
        this.message = "Invalid value";
        this.min = typeof options.min === "number" ? options.min : null;
        this.max = typeof options.max === "number" ? options.max : null;
    }

    /**
     * @inheritdoc
     * @param {string|array|object} value the value to be validated
     */
    validate(value) {
        var valid = 1;
        var intVal = parseInt(value, 10);

        if (this.min !== null && intVal < this.min) {
            valid &= 0;
        }

        if (this.max !== null && intVal > this.max) {
            valid &= 0;
        }

        return valid;
    }

}
module.exports = Between;