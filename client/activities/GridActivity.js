"use strict";
var Activity = require("./Activity");
var GridFormView = require("../views/GridForm");
var activityRequests = require("./requests");
var Request = require("./requests/Request");

/**
 * The activity that is inherited by all activities with a grid CRUD
 * @abstract
 */
class GridActivity extends Activity{

    /**
     * @constructor
     * @param {Backbone.Router} ctx - The application context
     */
    constructor(ctx){
        super(ctx);
        this.baseRoute = "entity";
    }

    /**
     * Defines the activity requests handles
     *
     * @returns {{}} - A map with the handles
     */
    requests() {
        var handlers = {};
        handlers[Request.ADD] = this.addRequest;
        return handlers;
    }

    /**
     * Called on activity start
     *
     * @returns {undefined}
     */
    onStart() {
        this.collection = this.getCollection();
        this.view = this.getView();
        this.view.setActivity(this);
        this.view.setCollection(this.collection);
        this.formView = new GridFormView(this, this.view.entityName);
    }

    /**
     * Called when the activity resumes
     *
     * @param {*} state The state object returned by the onPause method
     * @param {Array} args Route arguments
     * @param {string} route Route name
     * @returns {undefined}
     */
    onResume(state, args, route){
        this.view.render();
        if (route === (this.baseRoute + ".edit")) {
            this.listenToOnce(this.collection, "sync", function () {
                this.editEntity(this.collection.get(args[0]));
            });
        }
        if (route === (this.baseRoute + ".create")) {
            this.createEntity();
        }
        this.context.di.get("grid").list(this.collection);
    }

    /**
     * Called when the activity pauses
     *
     * @return {undefined}
     */
    onPause(){
        this.view.detach();
        this.formView.detach();
    }

    /**
     * Removes a car entity
     *
     * @param {Car} model the model to be removed
     * @returns {Promise} Promise to be fulfilled when the model is deleted
     */
    removeEntity(model) {
        return this.getService().destroy(model);
    }

    /**
     * Edits an instance of the model
     *
     * @param {Car} model the model to be edited
     * @returns {undefined}
     */
    editEntity(model) {
        if (!(model instanceof Backbone.Model)) {
            this.context.notFound();
        }
        this.formView.setModel(model);
        $("body").append(this.formView.render().el);
        this.context.navigate(this.baseRoute + "/" + model.get(model.idAttribute) + "/edit");
        this.listenToOnce(this.formView, "hidden.form", function () {
            this.navigate(this.baseRoute, {trigger: false});
        });
    }

    /**
     * Initializes the process of adding a new entity for the grid
     *
     * @returns {Promise} the promise that will be fulfilled after the model is saved
     */
    createEntity() {
        var model = new this.collection.model();
        var reject = null;
        var prm = new Promise(function (done, fail) {
            reject = fail;
            model.once("sync", _.bind(function () {
                this.collection.add(model);
                done(model);
            }, this));
            this.formView.setModel(model);
            $("body").append(this.formView.render().el);
            this.navigate(this.baseRoute + "/create", {trigger: false});
        }.bind(this)).then(function (model) {
            this.stopListening(this.formView, "hidden.form");
            return model;
        }.bind(this)).catch(function (err) {
            this.stopListening(this.formView, "hidden.form");
            return err;
        }.bind(this));
        prm.reject = reject;
        this.listenToOnce(this.formView, "hidden.form", function (result) {
            this.navigate(this.baseRoute, {trigger: false});
            // if the entity was not added, reject the promise
            if (!result) {
                prm.reject();
            }
        });
        return prm;
    }

    /**
     * Saves a car to the server
     *
     * @param {Car} model The model to be persisted
     * @param {Object} values The new values for the model
     * @returns {Promise} The promise that will be fulfilled when the model is saved
     */
    saveEntity(model, values) {
        model.set(values);
        return this.getService().persist(model);
    }

    /**
     * Searches for a given value in the collection
     *
     * @param {string} query The search query
     * @returns {undefined}
     */
    search(query) {
        this.collection.queryParams.q = query;
        this.collection.fetch({reset: true});
    }


    /**
     * Returns the instance of the collection
     *
     * @returns {GridCollection} The collection used by the grid
     * @abstract
     */
    getCollection() {
        throw new Error("Your activity must implement the getCollection method.");
    }

    /**
     * Returns the instance of the view
     *
     * @returns {GridView} The view used by the current activity instance
     * @abstract
     */
    getView() {
        throw new Error("Your activity must implement the getView method.");
    }

    /**
     * Returns the instance of the service used for CRUD actions
     *
     * @returns {GridService} The service used by the current activity instance
     * @abstract
     */
    getService() {
        throw new Error("Your activity must implement the getService method.");
    }

    /**
     * Handles add entity request from other activities
     *
     * @param {Request} req The request object
     * @returns {undefined}
     */
    addRequest(req) {
        this.createEntity().then(function (model) {
            req.resolve(model || null);
        });
        this.listenToOnce(req, "cancel", function () {
            this.formView.dismiss();
        });
    }

    /**
     * Initalizes a create entity request
     *
     * @param {string} requestName - the name of the request
     * @returns {Promise.<TResult>} - te promise that will pe fulfilled when the request is fullfilled
     */
    initCreateRequest(requestName) {
        var currentPath = window.location.pathname.replace(/^\//, "");
        this.formView.detach();
        return this.context.activityRequest(activityRequests.createActivityRequest(requestName))
            .then(function (model) {
                this.navigate(currentPath, {trigger: false});
                this.formView.render();
                return model;
            }.bind(this));
    }
}

module.exports = GridActivity;
