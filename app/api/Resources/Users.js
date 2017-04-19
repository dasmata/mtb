"use strict";
let generator = require('generate-password');
let mailView = require('../../views/ActivateAccount');
let striptags = require('striptags');
let chance = new require('chance')();

/**
 * defines an epilogue resource for users
 */
class UsersResource {

    /**
     * @constructor
     * @param {Epiloque} epiloque - The instance of epilogue
     * @param {Express} app - The app context
     * @private
     */
    constructor(epiloque, app) {
        this.epiloque = epiloque;
        this.resource = null;
        this.model = app.get("db").Users;
        this.mailer = app.get("mailer");
        this.context = app;
    }

    /**
     * Initializes the epiloque resource for a user
     * @returns {*} - The generated resource
     */
    generateResource() {
        this.resource = this.epiloque.resource({
            model: this.model,
            endpoints: ['/users', '/users/:uuid'],
            excludeAttributes: ["password"]
        });
        this.registerMiddleware(this.resource.create.fetch, this.addPassword.bind(this));
        this.registerMiddleware(this.resource.create.complete, this.sendPasswordEmail.bind(this));
        return this.resource;
    }

    /**
     * Registers an apiloque milestone middleware
     * @param {*} hook - The epiloque milestone
     * @param {Funtion} callback - The middleware
     * @returns {undefined}
     */
    registerMiddleware(hook, callback) {
        hook(callback);
    }

    /**
     * Ads a password to the entity that will be created
     *
     * @param {Express.Request} req - The request object
     * @param {Express.Response} res - The response object
     * @param {Epiloque.Context} context - The api context
     * @returns {undefined}
     */
    addPassword(req, res, context) {
        if (typeof req.body.password === "undefined") {
            context.attributes.password = this.generateRandomPassword();
            context.attributes.activation_token = chance.guid({version: 4});
        }
        context.continue();
    }

    /**
     * Generates a random password when creating a user
     *
     * @returns {string} - The generated password
     */
    generateRandomPassword() {
        return generator.generate({
            length: 12,
            numbers: true,
            symbols: true,
            uppercase: true,
            strict: true
        });
    }

    /**
     * Sends the newly created user a password reset email
     *
     * @param {Express.Request} req - The request object
     * @param {Express.Response} res - The response object
     * @param {Epiloque.Context} context - The api context
     * @returns {undefined}
     */
    sendPasswordEmail(req, res, context) {
        mailView({url: this.context.get('config').baseUrl + '/user/activate/' + context.attributes.activation_token}).then((html) => {
            let mailData = {
                from: this.context.get('config').mailgun.from,
                to: context.attributes.email,
                subject: "Activare cont",
                text: striptags(html, [], "\n"),
                html: html
            };
            this.mailer.send(mailData);
        });
        context.continue();
    }
}

module.exports = function (epilogue, app) {
    let obj = new UsersResource(epilogue, app);
    return obj.generateResource();
};
