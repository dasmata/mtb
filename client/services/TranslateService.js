"use strict";
var Service = require("./Service");

/**
 * Service that handles the translations
 */
class Translation extends Service{

    /**
     * Translates a string
     *
     * @param {string} str The string to be traslated
     * @returns {string} The translated string
     */
    translate(str){
        return str;
    }

}


module.exports = Translation;
