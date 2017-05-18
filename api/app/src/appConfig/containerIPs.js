/**
 * Created by reharik on 7/26/15.
 */
"use strict";

module.exports = function(hostsparser, config, logger, fs) {
    return function () {
        var hosts = new hostsparser.Hosts(fs.readFileSync('/etc/hosts', 'utf8'));
        var frontend = hosts._origin.filter(function (i) {
            return i.hostname === 'frontend'
        });

        console.log(config);
        if (frontend.length > 0) {
            config.frontend.ip = frontend[0].ip;
            logger.info("frontend IP: " + frontend[0].ip);
        }

        var eventstore = hosts._origin.filter(function (i) {
            return i.hostname === 'eventstore'
        });

        if (eventstore.length > 0) {
            logger.info("eventstore IP: " + eventstore[0].ip);
        }

        var postgres = hosts._origin.filter(function (i) {
            return i.hostname === 'postgres'
        });

        if (postgres.length > 0) {
            logger.info("postgres IP: " + postgres[0].ip);
        }
    };
};