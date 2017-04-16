"use strict";
var Activity = require("./Activity");
var HomepageView = require("../views/Homepage");

/**
 * Handles the homepage
 */
class HomepageActivity extends Activity {
    /**
     * @inheritdoc
     */
    onCreate() {
        this.view = new HomepageView();
    }

    /**
     * @inheritdoc
     */
    onStart() {
        this.startPromise = this.context.di.get("acl").isAdmin().then((result) => {
            if (result) {
                this.context.navigate("dashboard", {trigger: true});
                throw "Admin redirect";
            }
        });
    }

    /**
     * @inheritdoc
     */
    onResume() {
        this.startPromise.then(function () {
            this.layout.renderContent(this.view);
        }).catch(function (_err) {
        });
    }

    /**
     * @inheritdoc
     */
    onDestroy() {
        this.view.remove();
        this.startPromise = null;
    }

    /**
     * @inheritdoc
     */
    onPause() {
        this.view.detach();
    }
}

module.exports = HomepageActivity;
