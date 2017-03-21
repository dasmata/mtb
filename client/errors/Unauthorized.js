"use strict";

/**
 * Class that represents an Unauthorized error
 */
class Unauthorized{
    /**
     * @constructor
     * @param {*} code Error code
     * @param {string} message Error message
     */
    constructor(code, message){
        this.code = code;
        this.message = message;
    }
}

module.exports = Unauthorized;
