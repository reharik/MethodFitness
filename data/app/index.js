/**
 * Created by rharik on 7/13/15.
 */
"use strict";

var extend = require('extend');
var config = require('config');

module.exports = function(_options) {
    var options = {};
    console.log(`==========config=========`);
    console.log(config.configs.children.eventstore);
    console.log(`==========END config=========`);
    extend(options, config.get('configs') || {}, _options || {});
    var container = require('./registry')(options);
    var bootstrap = container.getInstanceOf('bootstrap');
    bootstrap()
}();

