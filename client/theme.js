"use strict";
var routes = require("./routes");
var di = require("./DI");
var MiddlewareResponse = require("./MiddlewareResponse");
var Activities = require("./activities");


/**
 * Te application object. Manages routes, activities and middleware
 */
var app = new (Backbone.Router.extend({
    /**
     * @constructor
     */
    "constructor": function () {
        this.routesMap = {};
        this.middlewares = {};
        this.activities = {};
        this.activity = null;
        this.di = di;
        this.activeRequests = {};
        Backbone.Router.prototype.constructor.apply(this);
    },

    /**
     * inits application routes and activities
     * @returns {undefined}
     */
    "routes": function () {
        var result = {};
        routes.forEach((el)=> {
            result[el.path] = el.name;
            this.mapRoute(el.name, el.activity);
            this.middlewares[el.name] = el.middlewares;
        });
        return result;
    },
    /**
     * Maps a route to an activity name
     *
     * @param {string} name The name of the route
     * @param {string} activity The name of the activity
     * @returns {undefined}
     */
    "mapRoute": function (name, activity) {
        this.routesMap[name] = activity;
    },

    /**
     * Resumes the activity fr the requested route
     *
     * @param {function} callback The routes defined callback
     * @param {Object} args Route's arguments
     * @param {string} name Route's name
     * @returns {undefined}
     */
    "execute": function (callback, args, name) {
        this.applyMiddlewares(name).then(function () {
            if (this.activity !== null) {
                this.activities[this.activity.id] = this.activity.pause();
            }
            this.activity = this.getActivity(this.routesMap[name]);
            this.activity.resume(this.activities[this.activity.id], args, name);
        }.bind(this)).catch(function (e) {
            if (e === MiddlewareResponse.CANCELED || e === MiddlewareResponse.REDIRECTED) {
                return;
            }
            throw e;
        });
    },

    /**
     * Applies the declared middlewares for the route
     *
     * @param {string} routeName The route's name
     * @returns {Promise.<TResult>} The promise that will be fulfilled after all the middlewares are called
     */
    "applyMiddlewares": function (routeName) {
        var response = null;
        var responseChain = MiddlewareResponse.init().then((rsp)=> {
            response = rsp;
            response.setApp(this);
        });
        if (typeof this.middlewares[routeName] === "undefined") {
            return responseChain;
        }
        this.middlewares[routeName].forEach(function (serviceData) {
            var serviceName = typeof serviceData === "string" ? serviceData : serviceData.name;
            var params = serviceData.params || [];
            responseChain = responseChain.then(function () {
                return this.di.get(serviceName).handleRoute(routeName, response, params);
            }.bind(this));
        }.bind(this));
        responseChain.catch(function (_e) {
        });
        return responseChain;
    },

    /**
     * Handles requests between acticities
     *
     * @param {Request} req The request object
     * @returns {Promise} The promise that will be fulfilled when the request is resolved
     */
    "activityRequest": function (req) {
        var reject = null;
        var prm = new Promise(function (done, fail) {
            req.once("resolve", function (data) {
                done(data);
            });
            reject = fail;
        });
        var resumeParentActivity = function () {
            this.activity.pause();
            this.activity = req.getParentActivity();
            this.activity.resume();
        }.bind(this);
        this.activeRequests[req.cid] = {
            request: req,
            promise: prm
        };
        this.activity.pause();
        this.activity = this.getActivity(req.setParentActivity(this.activity).getTargetActivity())
            .resume();
        this.activity.handleActivityRequest(req);
        prm.then(function (data) {
            delete this.activeRequests[req.cid];
            resumeParentActivity();
            return data;
        }.bind(this));
        prm.catch(function (err) {
            delete this.activeRequests[req.cid];
            resumeParentActivity();
            return err;
        });
        prm.reject = reject;
        return prm;
    },
    /**
     * Cancels and activity request
     *
     * @param {Request} req The request to be canceled
     * @returns {undefined}
     */
    "cancelActivityRequest": function (req) {
        if (!this.activeRequests[req.cid]) {
            return;
        }
        req.trigger("cancel");
        this.activeRequests[req.cid].promise.reject();
        req.off("resolve");
        req.trigger("canceled");
    },

    /**
     * Creates an istance of the requested activity
     *
     * @param {string} name The name of the activity
     * @returns {Activity} The requested activity
     */
    "getActivity": function (name) {
        if (this.activities[name]) {
            return this.activities[name];
        }
        this.activities[name] = new Activities[name](this);
        this.activities[name].start();
        return this.activities[name];
    },

    /**
     * Destroys an activity by it's name or id
     *
     * @param {string | Activity} activity The activity that will e destroyed
     * @returns {undefined}
     */
    "destroyActivity": function(activity){
        var activityInstance = typeof activity === "string" ? this.activities[activity] : activity;
        var name = typeof activity === "string" ? activity : Object.keys(this.activities).reduce(function(value, item, idx){
            if(item === activity){
                return idx;
            }
            return null;
        }, null);
        activityInstance.destroy();
        delete this.activities[name];
    }
}))();

Backbone.history.start({pushState: true});
module.exports = app;