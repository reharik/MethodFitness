"use strict";

module.exports = function(rsRepository, logger) {

    var fetchAllClients = async function (ctx) {
        logger.debug("arrived at clientlist.fetchAllClients");

        try {
            let client;
            let sql = 'SELECT * from "client";';

            if (ctx.state.user.role !== 'admin') {
                const trainer = await rsRepository.getById(ctx.state.user.id, 'trainer');
                sql = `SELECT * from "client" where id in (${trainer.clients.map(item => `'${item}'`)});`;
            }
            var query = await rsRepository.query(sql);

        } catch (ex) {
            throw ex;
        }
        ctx.body = {clients: query};
        ctx.status = 200;
    };

    var fetchClients = async function (ctx) {
        logger.debug("arrived at clientlist.fetchClients");

        try {
            let sql = 'SELECT * from "client" where not "archived";';
            var query;
            // if (ctx.state.user.role !== 'admin') {
            //     const trainer = await rsRepository.getById(ctx.state.user.id, 'trainer');
            //     sql = `SELECT * from "client" where  not "archived" AND id in (${trainer.clients.map(item => `'${item}'`)})`;
            // }
            query = await rsRepository.query(sql);

        } catch (ex) {
            throw ex;
        }
        ctx.body = {clients: query};
        ctx.status = 200;
    };

    return {
        fetchClients,
        fetchAllClients
    };

};

