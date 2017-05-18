module.exports = function(R, _fantasy, appfuncs, uuid, logger, pgFuture) {

    return {
        checkIdempotency: function(commitPosition, eventHandlerName) {
            var query = 'SELECT * from "lastProcessedPosition" where "handlerType" = \'' + eventHandlerName + '\'';
            logger.debug(query);

            var handleResult = x => {
                const row = x.rows[0];
                const rowPosition = row && row.commitPosition ? row.commitPosition : -1;
                logger.debug(`event commit possition ${commitPosition}. 
                    db commit possition ${rowPosition}.`);
                var idempotent = parseInt(commitPosition) > parseInt(rowPosition);
                var result = {isIdempotent: idempotent};
                logger.debug(result);
                return result;
            };
            return pgFuture(query, handleResult);
        },

        recordEventProcessed: function(commitPosition, eventHandlerName) {
            var fh      = appfuncs.functionalHelpers;

            var query = `WITH UPSERT AS (
 UPDATE "lastProcessedPosition"
 SET "commitPosition" = '${commitPosition}',
  "handlerType" =  '${eventHandlerName}'
 WHERE "handlerType" = '${eventHandlerName}' )
 INSERT INTO "lastProcessedPosition"
 ("id", "commitPosition", "handlerType")
 SELECT '${uuid.v4() }' , '${commitPosition}', '${eventHandlerName }'
WHERE NOT EXISTS ( SELECT 1 from "lastProcessedPosition" where "handlerType" = '${eventHandlerName}')`;

            var handlerResult = r=>_fantasy.Maybe.of(r);
            return pgFuture(query, handlerResult);
        }
    }
};
