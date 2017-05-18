///**
// * Created by parallels on 7/16/15.
// */
//"use strict";
//
//module.exports = function(appdomain, eventhandlerbase, eventrepository, logger) {
//    return {
//        handleEvent: function (event) {
//            return eventHandlerBase.handleEvent(event, 'HireTrainerWorkflow', handlers[event.eventName]);
//        },
//        handlers     : {
//            hireTrainer: function (cmd) {
//                var trainer = new appdomain.Trainer();
//                trainer.hireTrainer(cmd.data);
//                return eventrepository.save(trainer, {continuationId: cmd.continuationId});
//            }
//        },
//        handlesEvents: ['hireTrainer']
//    };
//};
