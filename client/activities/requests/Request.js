"use strict";
/**
 * Class representing an activity request
 *
 * @abstract
 */
class Request {
    /**
     * @constructor
     * @param {*} data The data attached to this request
     */
    constructor(data) {
        this.setData(data);
        Object.assign(this, Backbone.Events);
        this.cid = _.uniqueId("areq");
    }

    /**
     * Returns the type of the request
     *
     * @abstract
     * @public
     * @returns {int} The type of the request: Request.VIEW | Request.EDIT | Request.ADD | Request.INFO
     */
    getType() {
        throw new Error("This method should be implemented in the concrete implementation of the request");
    }

    /**
     * Returns the target activity identifier
     *
     * @abstract
     * @public
     * @returns {string} The target activity identifier
     */
    getTargetActivity() {
        throw new Error("This methos should be implemented in the concrete implementation of the request");
    }

    /**
     * Sets the request data
     *
     * @public
     * @param {*} data The data associated to the request
     * @returns {Request} The current object
     */
    setData(data) {
        this.data = data;
        return this;
    }

    /**
     * Returns the data associated with the request
     *
     * @public
     * @returns {*} The data associated with the request
     */
    getData() {
        return this.data;
    }


    /**
     * Method called when the current request is resolved
     *
     * @public
     * @param {*} data The data resulted on Request completion
     * @returns {undefined}
     */
    resolve(data) {
        this.trigger("resolve", data);
        return this;
    }

    /**
     * The activity that created the request
     *
     * @param {Activity} act The callee activty
     * @return {Request} the current object
     */
    setParentActivity(act) {
        this.parentActivity = act;
        return this;
    }

    /**
     * returns the callee activity
     *
     * @return {Activity|*} the activity that created the request
     */
    getParentActivity() {
        return this.parentActivity;
    }
}


/**
 * Request type that represents a view request
 * The request data and response can be (but not necessarily) empty
 * @type {number}
 */
Request.VIEW = 1;
/**
 * Request type that represents a request to add an entity.
 * The resolution data should contain the newly created entity
 *
 * @type {number}
 */
Request.ADD = 2;
/**
 * Request type that represents a request to edit and entity.
 * The request data should contain the id of the entity to be edited
 * The resolution data should contain the edited entity
 *
 * @type {number}
 */
Request.EDIT = 3;
/**
 * Request for obtaining informations from the user.
 * The request and resolution data should reflect the information that is requested.
 *
 * @type {number}
 */
Request.INFO = 4;

module.exports = Request;
