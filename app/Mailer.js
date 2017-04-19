"use strict";
let mailgun = require("mailgun-js");


/**
 * Class used to send the emails
 */
class Mailer {

    /**
     * @constructor
     * @param {{}} config - The application config
     */
    constructor(config) {
        this.mailgun = mailgun({apiKey: config.mailgun.api_key, domain: config.mailgun.domain});
    }

    /**
     * Sends an email using the mailgun API
     * @param {{}} data - The email data. Example:
     * {
     *  from: '"Sender Name" <sender@test.com>',
     *  to: recipient@test.com,
     *  subject: "Email subject",
     *  text: "Text version of the email",
     *  html: "Html string of the email"
     * }
     * @returns {Promise} - The promise that will be fulfilled when the email is sent
     */
    send(data) {
        return new Promise((done, fail) => {
            this.mailgun.messages().send(data, function (err) {
                if (err) {
                    fail();
                    return;
                }
                done();
            });
        });
    }
}

module.exports = function (app) {
    return new Mailer(app.get('config'));
};
