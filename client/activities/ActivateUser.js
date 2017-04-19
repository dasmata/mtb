"use strict";

let Activity = require("./Activity");
let ActivateUserView = require("../views/ActivateUserView");
let LoginLayoutView = require("../views/LoginLayout");
let layout = new LoginLayoutView;

/**
 * Activity that handles the user activation
 */
class ActivateUser extends Activity {
    /**
     * @inheritdoc
     */
    onCreate() {
        this.layout = layout;
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
        this.layout.resetGenericErrors();
        return this.context.di.get("security").activateAccount(values, this.activationKey).then(()=>{
            this.context.navigate("/", {trigger: true});
            this.context.destroyActivity(this);
            this.context.di.get("flashMessage").add("success", "Contul tau a fost activat cu succes. Te rugam sa te autentifici folosint parola pe care tocmai ai setat-o");
        }).catch((e)=>{
            this.layout.renderGenericError(e);
        });
    }
}


module.exports = ActivateUser;

