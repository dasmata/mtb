"use strict";

class MiddlewareResponse {
    cancel() {
        return Promise.reject(MiddlewareResponse.CANCELED);
    }

    continue() {
        return Promise.resolve(MiddlewareResponse.CONTINUE);
    }

    redirect(url) {
        this.getApp().navigate(url);
        return Promise.reject(MiddlewareResponse.REDIRECTED);
    }

    setApp(app) {
        this.app = app;
        return this;
    }

    getApp() {
        return this.app;
    }

}

var obj = {
    CANCELED: 0,
    REDIRECTED: 1,
    CONTINUE: 2,
    init: function () {
        var prm = Promise.resolve(new MiddlewareResponse());
        return prm;
    }
};

Object.assign(MiddlewareResponse, obj);

module.exports = obj;
