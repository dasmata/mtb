"use strict";
/**
 * Class representing the middleware response
 */
class MiddlewareResponse {
    /**
     * Cancels a request
     *
     * @returns {Promise.<*>} Rejected promise
     */
    cancel() {
        return Promise.reject(MiddlewareResponse.CANCELED);
    }

    /**
     * Instructs the request t the next middleware
     * @returns {Promise.<number>} Accepted request
     */
    continue() {
        return Promise.resolve(MiddlewareResponse.CONTINUE);
    }

    /**
     * Redirects the request to an url. Also cancel the current request
     * @param {string} url The url to redirect to
     * @returns {Promise.<*>} The canceled promise
     */
    redirect(url) {
        this.getApp().navigate(url, {trigger: true});
        return Promise.reject(MiddlewareResponse.REDIRECTED);
    }

    /**
     * Sets the object representing the app context
     *
     * @param {Backbone.Router} app The app context
     * @returns {MiddlewareResponse} The current object
     */
    setApp(app) {
        this.app = app;
        return this;
    }

    /**
     * Returns the app context
     *
     * @returns {Backbone.Router|*} The app context
     */
    getApp() {
        return this.app;
    }

}

var obj = {
    CANCELED: 0,
    REDIRECTED: 1,
    CONTINUE: 2,
    init: function () {
        var prm = Promise.resolve(new MiddlewareResponse());
        return prm;
    }
};

Object.assign(MiddlewareResponse, obj);

module.exports = obj;
