/**
 * Created by rharik on 6/19/15.
 */
module.exports = function(eventHandler,
                          logger,
                          Trainer) {

    return {
        handlesEvents: ['bootstrapApplication'],
        handleEvent  : function(event) {
            console.log(event);
            return eventHandler.handleEvent(event, 'BootstrapApplicationWorkflow', handlers[event.eventName]);
        },
        handlers     : {
            loginTrainer(vnt) {
                console.log(vnt);
                this.createNotification(vnt);
                //var trainer = eventrepository.getById(appdomain.Trainer, vnt.Id);
                //trainer.loginTrainer(vnt);
                //eventrepository.save(trainer, {continuationId});
            },
            bootstrapApplication(vnt) {
                console.log(vnt);
                this.hireTrainer();
            }
        },

        hireTrainer() {
            logger.info('calling hiretrainer');
            var trainer = new Trainer();
            trainer.hireTrainer({
                credentials: {
                    userName: 'admin',
                    password: '123456'
                },
                contact    : {
                    firstName   : 'Raif',
                    lastName    : 'Harik',
                    emailAddress: 'reharik@gmail.com',
                    phone       : '666.666.6666',
                    secondPhone : '777.777.7777'
                },
                address    : {
                    address1: '1706 willow st',
                    address2: 'b',
                    city    : 'Austin',
                    state   : 'TX',
                    zipCode : '78702'
                }
                ,
                dob        : new Date()
            });
            logger.info('saving trainer');
            logger.trace(trainer);
            //eventrepository.save(trainer);
        }
    };
};
