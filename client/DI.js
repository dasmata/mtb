"use strict";

var services = require("./services.js");
var instances = {};
var servicesIndex = {};

/**
 * Dependency injection class
 * @constructor
 */
function DI(){
    services.forEach(_.bind(function(service, _idx){
        servicesIndex[service.name] = service;
    }, this));
}

/**
 * Returns the instance of a service
 *
 * @param {string} name the name of the service
 * @returns {Service} The requested service
 */
DI.prototype.get = function(name){
    return instances[name] || this.createInstance(
        servicesIndex[name].serviceConstructor,
        servicesIndex[name].params || [],
        servicesIndex[name].name
    );
};

/**
 * Registers a service in the DI
 *
 * @param {string} name The name of the service
 * @param {function} serviceConstructor The constructor of the service
 * @param {object} params Params that should be passed to the constructor
 * @returns {undefined}
 */
DI.prototype.register = function(name, serviceConstructor, params){
    servicesIndex[name] = {
        "name": name,
        "serviceConstructor": serviceConstructor,
        "params": params
    };
};

/**
 * Creates a service instance
 *
 * @param {function} constructor The constructor of the service
 * @param {object} params The params for the service constructor
 * @param {string} name The name of the service. Used to check for circular dependencies
 * @return {Service} The service instance
 */
DI.prototype.createInstance = function(constructor, params, name){
    var instanceParams = [];
    var instance = null;
    params.forEach(_.bind(function(paramName, _index){
        if(typeof servicesIndex[paramName] === "undefined"){
            throw new Error("Cannot find service " + paramName);
        }
        (servicesIndex[paramName].params || []).forEach(function(level2Param, _idx){
            if(name === level2Param){
                throw new Error("Circular dependency detected between " + name + " and " + paramName + " services");
            }
        });
        instanceParams.push(this.get(paramName));
    }, this));
    instance = Object.create(constructor.prototype);
    constructor.apply(instance, instanceParams);
    instance.constructor = constructor;
    return instance;

};

module.exports = new DI();
