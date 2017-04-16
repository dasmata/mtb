"use strict";
var validatorClasses = require("../validator");
var ValidationError = require("../errors/Validation");
var Service = require("./Service");

/**
 * Service that handles the grid entities actions
 */
class GridService extends Service {

    /**
     * Creates a get http request for the provided collection
     * @param {GridCollection} collection - The collection to be fetched
     * @returns {Promise} - THe promise that will be fulfilled when the request is over
     */
    list(collection) {
        return this.getRequestPromise(collection).then(() => {
            return new Promise((done, _fail) => {
                collection.fetch().then(function () {
                    done(collection);
                });
            });
        }).catch(function(){});
    }

    /**
     * Creates a delete http request for the entity
     *
     * @param {Backbone.Model} model The model to be destroyed
     * @returns {Promise} The promise that will be fulfilled or rejected when the delete call is over
     */
    destroy(model) {
        return this.getRequestPromise(model).then(() => {
            return new Promise(function (done, fail) {
                var deleteCallback = function () {
                    model.off("error", errorCallback);
                    done(model);
                };
                var errorCallback = function () {
                    model.off("sync", deleteCallback);
                    fail();
                };
                model.once("sync", deleteCallback);
                model.once("error", errorCallback);
                model.destroy();
            });
        });
    }

    /**
     * Saves a model through the ajax request
     *
     * @param {Backbone.Model} model the model to be saved
     * @returns {Promise} The promise that will be fulfilled when the model is saved
     */
    persist(model) {
        this.setValidators(model.schema);
        return this.validate(model.toJSON())
            .then(_.bind(function (errors) {
                if (errors.length === 0) {
                    return new Promise(function (done, fail) {
                        var saveCallback = function () {
                            model.off("error", errorCallback);
                            done(model);
                        };
                        var errorCallback = function (err) {
                            model.off("sync", saveCallback);
                            fail(err);
                        };

                        model.once("sync", saveCallback);
                        model.once("error", errorCallback);
                        model.save();
                    });
                }
                return errors;
            }, this));
    }

    /**
     * Sets the model validators
     *
     * @param {object} schema The model schema
     * @returns {this} the current object
     */
    setValidators(schema) {
        this.validators = {};
        Object.keys(schema).forEach(_.bind(function (field) {
            var validators = schema[field].validate;
            this.validators[field] = [];
            if (typeof validators !== "object" || validators.constructor !== Array) {
                return true;
            }
            validators.forEach(_.bind(function (validator) {
                var name = typeof validator === "string" ? validator : validator.name;
                var params = typeof validator === "string" ? {} : (validator.params || {});
                if (validatorClasses[name]) {
                    this.validators[field].push(new validatorClasses[name](params));
                } else {
                    throw new Error("Unknown validator " + name + ". Available validators are: " + Object.keys(validatorClasses).join(", "));
                }
            }, this));
        }, this));
        return this;
    }

    /**
     * Validates the form data
     *
     * @param {Object} data The form's data
     * @returns {Promise.<TResult>} the promise that get fulfilled after the validation process
     */
    validate(data) {
        var valid = 1;
        var results = [];
        var fields = [];
        var validatorsIndex = [];
        if (this.validators.length < 1) return;
        Object.keys(this.validators).forEach(_.bind(function (field) {
            this.validators[field].forEach(_.bind(function (validator) {
                fields.push(field);
                validatorsIndex.push(validator);
                results.push(validator.validate(data[field]));
            }, this));
        }, this));

        var registeredErrorFileds = {};
        return Promise.all(results).then(_.bind(function (results) {
            var errors = [];
            if (!results) return errors;
            var validationResult = results.reduce(_.bind(function (valid, currentValue, currentIndex) {
                if (!currentValue && !registeredErrorFileds[fields[currentIndex]]) {
                    errors.push(
                        new ValidationError(validatorsIndex[currentIndex].getMessage(), fields[currentIndex])
                    );
                    registeredErrorFileds[fields[currentIndex]] = true;
                }
                return errors;
            }, this), valid);
            return validationResult;
        }, this));
    }
}

module.exports = GridService;
