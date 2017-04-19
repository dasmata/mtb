"use strict";
var Layout = require("../views/Layout");
var id = 0;
var keyCodes = {
    "8": "backspace",
    "9": "tab",
    "13": "enter",
    "16": "shift",
    "17": "ctrl",
    "18": "alt",
    "19": "pause",
    "20": "capsLock",
    "27": "escape",
    "33": "pageUp",
    "34": "pageDown",
    "35": "end",
    "36": "home",
    "37": "left",
    "38": "up",
    "39": "right",
    "40": "down",
    "45": "insert",
    "46": "delete",
    "48": "0",
    "49": "1",
    "50": "2",
    "51": "3",
    "52": "4",
    "53": "5",
    "54": "6",
    "55": "7",
    "56": "8",
    "57": "9",
    "65": "a",
    "66": "b",
    "67": "c",
    "68": "d",
    "69": "e",
    "70": "f",
    "71": "g",
    "72": "h",
    "73": "i",
    "74": "j",
    "75": "k",
    "76": "l",
    "77": "m",
    "78": "n",
    "79": "o",
    "80": "p",
    "81": "q",
    "82": "r",
    "83": "s",
    "84": "t",
    "85": "u",
    "86": "v",
    "87": "w",
    "88": "x",
    "89": "y",
    "90": "z",
    "91": "Window",
    "92": "Window",
    "93": "select",
    "96": "0",
    "97": "1",
    "98": "2",
    "99": "3",
    "100": "4",
    "101": "5",
    "102": "6",
    "103": "7",
    "104": "8",
    "105": "9",
    "106": "*",
    "107": "=",
    "109": "-",
    "110": ".",
    "111": "/",
    "112": "f1",
    "113": "f2",
    "114": "f3",
    "115": "f4",
    "116": "f5",
    "117": "f6",
    "118": "f7",
    "119": "f8",
    "120": "f9",
    "121": "f10",
    "122": "f11",
    "123": "f12",
    "144": "numLock",
    "145": "scrollLock",
    "186": "semiColon",
    "187": "=",
    "188": ",",
    "189": "/",
    "190": ".",
    "191": "/",
    "192": "6",
    "219": "[",
    "220": "\\",
    "221": "]",
    "222": "'"
};

var LayoutView = new Layout();

/**
 * Base activity class. This class is abstract and should never be used.
 * Use Activity.extend({}) instead.
 *
 * @param {Backbone.Router} ctx The application object
 * @constructor
 */
class Activity {

    /**
     * @constructor
     *
     * @param {Backbone.Router} ctx The application context
     */
    constructor(ctx) {
        this.context = ctx;
        _.extend(this, Backbone.Events);
        this.id = "a" + (id++);
        this.create();
    }

    /**
     * Run on create event
     * @return {undefined}
     */
    create() {
        this.layout = LayoutView;
        this.layout.setActivity(this);
        if (typeof this.onCreate === "function") {
            this.onCreate();
        }
    }

    /**
     * Run on start event
     *
     * @return {undefined}
     */
    start() {
        if (typeof this.onStart === "function") {
            this.onStart();
        }
    }

    /**
     * Activity cleanup
     *
     * @return {undefined}
     */
    destroy() {
        if (typeof this.onDestroy === "function") {
            this.onDestroy();
        }
    }

    /**
     * Paues the current activity
     *
     * @returns {*} The state of the activity
     */
    pause() {
        $(document).unbind("keyup");
        this.layout.removeFlashMessages();
        if (typeof this.onPause === "function") {
            return this.onPause();
        }
    }

    /**
     * Resumes the current activity
     *
     * @param {*} state State returned by onPause
     * @param {Array} args the arguments fr resume
     * @param {string} name The route's name
     * @returns {Activity} The current object
     */
    resume(state, args, name) {
        this.layout.setActivity(this);
        this.layout.render();
        if (typeof this.onResume === "function") {
            this.onResume(state, args, name);
        }
        $(document).on("keyup", function (e) {
            var eventName = "";
            if (e.ctrlKey) {
                eventName += "ctrl+";
            }
            if (e.shiftKey) {
                eventName += "shift+";
            }
            if (e.altKey) {
                eventName += "alt+";
            }
            eventName += keyCodes[e.keyCode];
            e.preventDefault();
            e.stopPropagation();
            e.hotkeys = eventName;
            this.trigger(eventName, e);
        }.bind(this));
        this.context.di.get("flashMessage").getAll().forEach((msg)=>{
            this.layout.renderFlashMessage(msg);
        });
        return this;
    }

    /**
     * Ads a tabindex of -1 to the menu
     *
     * @returns {undefined}
     */
    disableMenuKeyAccess() {
        $(".menuitem").attr("tabindex", "-1");
    }


    /**
     * Navigates to another activity
     *
     * @param {string} url the url to navigate to
     * @param {object} options the options for the router
     * @return {undefined}
     */
    navigate(url, options) {
        this.context.navigate(url, _.extend({trigger: false}, (options || {})));
    }

    /**
     * Handles requests from other activities
     *
     * @param {Request} req The request object
     * @returns {undefined}
     */
    handleActivityRequest(req) {
        var type = req.getType();
        var requests = (typeof this.requests === "object" ? this.requests : (typeof this.requests === "function" ? this.requests() : {})) || {};
        if (typeof requests[type] === "function") {
            requests[type].call(this, req);
        }
    }

    /**
     * Initializes a http request via acl service to retrieve de user's menu
     *
     * @returns {undefined}
     */
    getUserMenu(){
        return this.context.di.get("acl").getUserMenu();
    }
}

module.exports = Activity;
