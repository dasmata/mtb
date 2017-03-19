"use strict";

/**
 * Abstract service class
 *
 * @abstract
 */
class Service {

    /**
     * @constructor
     */
    constructor(){
        Object.assign(this, Backbone.Events);
    }

}

module.exports = Service;