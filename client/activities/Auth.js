"use strict";
var Activity = require("./Activity");
var LoginView = require("../views/Login");
var LoginLayoutView = require("../views/LoginLayout");
var layout = new LoginLayoutView;

/**
 * The Auth activity
 */
class Auth extends Activity{

    /**
     * @inheritdoc
     */
    onCreate(){
        this.layout = layout;
    }

    /**
     * @inheritdoc
     */
    onStart(){
        this.view = new LoginView({activity:this});
    }

    /**
     * @inheritdoc
     */
    onResume(){
        this.layout.renderContent(this.view);
    }

    /**
     * @inheritdoc
     */
    onPause(){
        this.view.detach();
    }

    /**
     * @inheritdoc
     */
    onDestroy(){
        this.view = null;
        this.layout.remove();
    }

    /**
     * Authenticates the user
     * @param {Object} credentials The username and password
     * @returns {Promise} The promise that will be fulfilled when the user is auth
     */
    login(credentials){
        this.view.hideLoginError();
        return this.context.di.get("security").loginUser(credentials)
            .then(()=>{
                this.navigate("/", {trigger: true});
            }).catch((_error)=>{
                this.view.displayLoginError(new Error(this.context.di.get("translate").translate("Invalid username or password")));
            });
    }
}

module.exports = Auth;