"use strict";
var Activity = require("./Activity");
var LoginView = require("../views/Login");

/**
 * The Auth activity
 */
class Auth extends Activity{

    /**
     * @inheritdoc
     */
    onStart(){
        this.view = new LoginView();
    }

    /**
     * @inheritdoc
     */
    onResume(){
        this.layout.renderContent(this.view);
    }

}

module.exports = Auth;