"use strict";
var Request = require("./Request");

/**
 * Represents a login request. The request is handled by the Auth activity
 */
class LoginRequest extends Request{

    /**
     * @inheritdoc
     */
    getType(){
        return Request.INFO;
    }

    /**
     * @inheritdoc
     */
    getTargetActivity(){
        return "Auth";
    }
}

module.exports = LoginRequest;