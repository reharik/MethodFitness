module.exports = function(bcryptjs, uuid, invariant) {
  const createPassword = _password => {
    try {
      let salt = bcryptjs.genSaltSync(10);
      let hash = bcryptjs.hashSync(_password, salt);
      return hash;
    }
    catch (err) {
      throw err;
    }
  };

  return {
    trainers: [
      {
        birthDate: new Date('1/5/1972'),
        color: '#ec42f5',
        contact: {
          firstName: 'Amahl',
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
        },
        trainerId: uuid.v4()
      },
      {
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
        },
        trainerId: uuid.v4()
      },
      {
        birthDate: new Date('1/5/1972'),
        color: '#f59242',
        contact: {
          firstName: 'Raif',
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
        },
        trainerId: uuid.v4()
      }],

    addTrainer: trainer => {
      invariant(trainer.contact.firstName, 'hireTrainer requires that you pass the trainers first name');
      invariant(trainer.contact.lastName, 'hireTrainer requires that you pass the trainers last name');
      invariant(trainer.contact.email, 'hireTrainer requires that you pass the trainers email');
      invariant(trainer.contact.mobilePhone, 'hireTrainer requires that you pass the trainers mobilePhone');
      invariant(trainer.credentials.password, 'hireTrainer requires that you pass the trainers password');
      invariant(trainer.credentials.role, 'hireTrainer requires that you pass the trainers role');
      return trainer;
    }
  };
};
