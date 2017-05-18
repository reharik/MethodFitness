///**
// * Created by parallels on 7/16/15.
// */
//"use strict";
//
//module.exports = function(appdomain, eventhandlerbase, eventrepository, logger) {
//    return {
//        handleEvent: function (event) {
//            return eventHandlerBase.handleEvent(event, 'LoginTrainerWorkflow', handlers[event.eventName]);
//        },
//        handlers     : {
//            loginTrainer(vnt) {
//                this.createNotification(vnt);
//                var trainer = eventrepository.getById(appdomain.Trainer, vnt.Id);
//                trainer.loginTrainer(vnt);
//                eventrepository.save(trainer, {continuationId});
//            }
//        },
//        handlesEvents: ['loginTrainer']
//    };
//};
