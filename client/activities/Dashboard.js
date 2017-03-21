"use strict";

var Activity = require("./Activity");
var DashboardView = require("../views/Dashboard");
var moment = require("moment");
var Unauthorized = require("../errors/Unauthorized");
var requests = require("./requests");

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
        this.context.di.get("reservations")
            .getReservations(moment(new Date())
            .format("YYYY-MM-DD"))
            .catch((error)=>{
                if(error.constructor === Unauthorized){
                    this.context.activityRequest(requests.createActivityRequest("Login")).then((token)=>function(){
                        if(token){
                            this.onStart();
                        }
                    });
                }
            });
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
