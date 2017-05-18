/**
 * Created by rharik on 11/23/15.
 */


module.exports = function(R, _fantasy, appfuncs, uuid, logger, pgFuture) {
    return {
        getById: function(id, table) {
            var query         = ('SELECT * from "' + table + '" where "id" = \'' + id + '\'');
            logger.debug(query);
            var handlerResult = x => {
                const row = x.rows[0];
                return row && row.document ? row.document : {}
            };

            // var handlerResult = R.compose(R.chain(fh.safeProp('document')), fh.safeProp('rows'));
            return pgFuture(query, handlerResult);
        },

        getByIds: function(ids, table) {
            var query         = (`SELECT * from "${table}" where "id" in '(${ids.split(',')})'`);
            logger.debug(query);
            var handlerResult = x => {
                const row = x.rows[0];
                return row && row.document ? row.document : {}
            };

            // var handlerResult = R.compose(R.chain(fh.safeProp('document')), fh.safeProp('rows'));
            return pgFuture(query, handlerResult);
        },

        save: function(table, document, id) {
            var query;
            if (id) {
                query = 'UPDATE "' + table + '" SET document = \'' + JSON.stringify(document) + '\' where id = \'' + id + '\'';
            } else {
                query = 'INSERT INTO "' + table + '" ("id", "document") VALUES (\'' + document.id + '\',\'' + JSON.stringify(document) + '\')';
            }
            logger.debug(query);
            var handlerResult = r=>_fantasy.Maybe.of(r);
            return pgFuture(query, handlerResult);
        },

        saveQuery: function(query) {
            logger.debug(query);

            var handlerResult = r=>_fantasy.Maybe.of(r);
            return pgFuture(query, handlerResult);
        },

        query: function(query) {
            logger.debug(query);
            var fh      = appfuncs.functionalHelpers;
            
            // need to return proper element.  rows is an array of objects with id and document
            var handlerResult =  R.compose(R.map(fh.getSafeValue('document')), fh.getSafeValue('rows' ));
            return pgFuture(query, handlerResult);
        }
    }
};
