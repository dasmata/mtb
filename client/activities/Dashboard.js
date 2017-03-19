"use strict";

var Activity = require("./Activity");
var DashboardView = require("../views/Dashboard");
var moment = require("moment");

/**
 * The dashboard activity
 */
class Dashboard extends Activity{
    /**
     * @inheritdoc
     */
    onCreate(){
        this.view = new DashboardView();
    }

    /**
     * @inheritdoc
     */
    onStart(){
        this.context.di.get("reservations").getReservations(moment(new Date()).format("YYYY-MM-DD"));
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
        this.view.remove();
        this.view = null;
    }
}

module.exports = Dashboard;
