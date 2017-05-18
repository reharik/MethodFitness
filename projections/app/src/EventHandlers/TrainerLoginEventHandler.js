/**
 * Created by parallels on 7/16/15.
 */
"use strict";

module.exports = function(rsRepository, logger) {
    return function TrainerLoggedInEventHandler() {
        logger.info('TrainerLoggedInEventHandler started up');

        async function trainerLoggedIn(event) {
            var trainerLoggedIn = {
                userName: event.userName,
                id: event.id,
                token: event.token,
                date: event.date
            };
            return await rsRepository.save('trainerLoggedIn', trainerLoggedIn);
        }
        return {
            handlerName: 'TrainerLoggedInEventHandler',
            trainerLoggedIn
        }
    };
};