require('babel-polyfill');
require('babel-register');

module.exports = function(config,
                          Promise,
                          uuid, 
                          eventstore, 
                          migration,
                          invariant,
                          bcryptjs) {
  return function () {
    var createPassword = function (_password) {
      try {
        var salt = bcryptjs.genSaltSync(10);
        var hash = bcryptjs.hashSync(_password, salt);
        return hash;
      }
      catch (err) {
        throw err;
      }
    };

    var processCommands = async function (command, commandName) {
      await eventstore.commandPoster(
        command,
        commandName,
        uuid.v4());
    };

    var populateES = async function () {
      const clients = addClients();
      for (let x of clients) {
        let command = addClient(x);
        await processCommands(command, 'addClient');
      }

      const trainers = hireTrainers();
      trainers[1].clients = [clients[0].id, clients[1].id, clients[2].id];
      trainers[2].clients = [clients[2].id, clients[3].id, clients[4].id];

      for (let x of trainers) {
        let command = hireTrainer(x);
        await processCommands(command, 'hireTrainer');
      }
    };

    const hireTrainers = () => {
      const one = {
        birthDate: new Date('1/5/1972'),
        color: '#4286f4',
        contact: {
          firstName: 'Raif',
          lastName: 'Harik',
          email: 'admin',
          mobilePhone: '666.666.6666',
          secondaryPhone: '777.777.7777',
          address: {
            street1: '1706 willow st',
            street2: 'b',
            city: 'Austin',
            state: 'TX',
            zipCode: '78702'
          }
        },
        credentials: {
          password: createPassword('123123'),
          role: 'admin'
        }
      };

      const two = {
        birthDate: new Date('1/5/1972'),
        color: '#4286f4',
        contact: {
          firstName: 'Someone',
          lastName: 'Else',
          email: 'admin2',
          mobilePhone: '666.666.6666',
          secondaryPhone: '777.777.7777',
          address: {
            street1: '1706 willow st',
            street2: 'a',
            city: 'Austin',
            state: 'TX',
            zipCode: '78702'
          }
        },
        credentials: {
          password: createPassword('345345'),
          role: 'admin'
        }
      };

      const three =
        {
          birthDate: new Date('1/5/1972'),
          color: '#4286f4',
          contact: {
            firstName: 'Amahl',
            lastName: 'Harik',
            email: 'trainer',
            mobilePhone: '666.666.6666',
            secondaryPhone: '777.777.7777',
            address: {
              street1: '1 Richmond Square',
              street2: 'a',
              city: 'Providence',
              state: 'RI',
              zipCode: '02906'
            }
          },
          credentials: {
            password: createPassword('234234'),
            role: 'trainer'
          }
        };
      return [one, two, three];
    };

    const addClients = () => {
      const one = {
        contact: {
          firstName: 'Hanna',
          lastName: 'Abelow',
          secondaryPhone: '',
          mobilePhone: '9172394046',
          email: 'hc.abelow@gmail.com',
          address: {
            street1: '77 Overhill Road',
            street2: '',
            city: 'Providence',
            state: 'RI',
            zipCode: '02916',
          }
        },
        source: 'referral',
        startDate: new Date('1/1/2016'),
        sourceNotes: 'Google',
        birthDate: new Date('1/1/1980'),
        id: uuid.v4()
      };

      const two = {
        contact: {
          firstName: 'Jessica',
          lastName: 'Ahern',
          secondaryPhone: '',
          mobilePhone: '774.219.3504',
          email: 'ahern.jessica@yahoo.com',
          address: {
            street1: '3 Thompson St.',
            street2: '',
            city: 'Providence',
            state: 'RI',
            zipCode: '02903'
          }
        },
        source: 'printAd',
        startDate: new Date('1/1/2016'),
        sourceNotes: 'Google',
        birthDate: new Date('1/1/1980'),
        id: uuid.v4()
      };
      const three = {
        contact: {
          firstName: 'Anthony',
          lastName: 'Akkaoui',
          secondaryPhone: '',
          mobilePhone: '401.383.5574',
          email: 'anthony.akkaoui@gmail.com',
          address: {
            street1: '1169 Bullocks Point Ave',
            street2: '',
            city: 'Providence',
            state: 'RI',
            zipCode: '02915'
          },
        },
        source: 'referral',
        startDate: new Date('1/1/2016'),
        sourceNotes: 'Google',
        birthDate: new Date('1/1/1980'),
        id: uuid.v4()
      };
      const four = {
        contact: {
          firstName: 'Amanda',
          lastName: 'Avedissian',
          secondaryPhone: '',
          mobilePhone: '401-573-9700',
          email: 'amanda.avedissian@gmail',
          address: {
            street1: 'PO Box 985',
            street2: '',
            city: 'Bristol',
            state: 'RI',
            zipCode: '02809'
          }
        },
        source: 'webSearch',
        startDate: new Date('1/1/2016'),
        sourceNotes: 'Google',
        birthDate: new Date('1/1/1980'),
        id: uuid.v4()
      };
      const five = {
        contact: {
          firstName: 'Sarah',
          lastName: 'Barr',
          secondaryPhone: '',
          mobilePhone: '4018298481',
          email: 'barr.sarahk@gmail.com',
          address: {
            street1: '35 Crescent St',
            street2: '',
            city: 'Waltham',
            state: 'MA',
            zipCode: '02403'
          }
        },
        source: 'driveWalkBy',
        startDate: new Date('1/1/2016'),
        sourceNotes: 'Google',
        birthDate: new Date('1/1/1980'),
        id: uuid.v4()
      };

      return [one, two, three, four, five]
    };

    const begin = async function () {
      await migration();
      // console.log('step0');
      // await sendMetadata();
      console.log('step3');
      await populateES();
      return;
    };

    const addClient = function (client) {
      invariant(client.contact.firstName, 'addClient requires that you pass the clients first name');
      invariant(client.contact.lastName, 'addClient requires that you pass the clients last name');
      invariant(client.contact.email, 'addClient requires that you pass the clients email');
      invariant(client.contact.mobilePhone, 'addClient requires that you pass the clients mobilePhone');
      invariant(client.startDate, 'addClient requires that you pass the clients startDate');
      return client
    };

    const hireTrainer = function (trainer) {
      invariant(trainer.contact.firstName, 'hireTrainer requires that you pass the trainers first name');
      invariant(trainer.contact.lastName, 'hireTrainer requires that you pass the trainers last name');
      invariant(trainer.contact.email, 'hireTrainer requires that you pass the trainers email');
      invariant(trainer.contact.mobilePhone, 'hireTrainer requires that you pass the trainers mobilePhone');
      invariant(trainer.credentials.password, 'hireTrainer requires that you pass the trainers password');
      invariant(trainer.credentials.role, 'hireTrainer requires that you pass the trainers role');
      return trainer;
    };

    begin();
  };
};
