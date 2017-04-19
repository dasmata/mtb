"use strict";
let fs = require('fs');
let jade = require('jade');

let prm = new Promise(function (done) {
    fs.readFile(__dirname + '/../../views/activation-email.jade', 'utf8', function (err, data) {
        if (err) throw err;
        fn = jade.compile(data);
        done();
    });
});
let fn = null;


module.exports = function (data) {
    return prm.then(function () {
        return fn(data);
    });
};
