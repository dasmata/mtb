"use strict";

var AbstractValidator = require("./Abstract");

/**
 * Class that validstes a value by a regular expression
 */
class RegExpValidator extends AbstractValidator {

    /**
     * @constructor
     * @param {RegExp} pattern te pattern to match against
     */
    constructor(pattern) {
        super();
        this.pattern = pattern;
    }

    /**
     * @inheritdoc
     */
    validate(value) {
        return this.pattern.test(value);
    }
}

module.exports = RegExpValidator;
