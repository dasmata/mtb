"use strict";

let Activity = require("./Activity");
let ActivateUserView = require("../views/ActivateUserView");

/**
 * Activity that handles the user activation
 */
class ActivateUser extends Activity {
    /**
     * @inheritdoc
     */
    onCreate() {
        this.view = new ActivateUserView({activity: this});
    }

    /**
     * @inheritdoc
     */
    onResume(state, args, _name) {
        this.activationKey = args[0];
        this.layout.renderContent(this.view);
    }

    /**
     * @inheritdoc
     */
    onDestroy() {
        this.activationKey = null;
        this.view.remove();
    }

    /**
     * @inheritdoc
     */
    onPause() {
        this.view.detach();
    }

    /**
     * Activates the current user's account
     * @param {{}} values - The password and confirm password values
     * @returns {Promise} - The promise that willbe fulfilled when the user's account is activated
     */
    activate(values){
        return this.context.di.get("security").activateAccount(values, this.activationKey).then(()=>{
            this.context.navigate("/", {trigger: true});
            this.context.destroyActivity(this);
        });
    }
}


module.exports = ActivateUser;

