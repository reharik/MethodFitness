module.exports = function(uuid, invariant) {
  return {
    clients: [
      {
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
        clientId: uuid.v4()
      },
      {
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
        clientId: uuid.v4()
      },
      {
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
        clientId: uuid.v4()
      },
      {
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
        clientId: uuid.v4()
      },
      {
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
        clientId: uuid.v4()
      }],

    addClient: client => {
      invariant(client.contact.firstName, 'addClient requires that you pass the clients first name');
      invariant(client.contact.lastName, 'addClient requires that you pass the clients last name');
      invariant(client.contact.email, 'addClient requires that you pass the clients email');
      invariant(client.contact.mobilePhone, 'addClient requires that you pass the clients mobilePhone');
      invariant(client.startDate, 'addClient requires that you pass the clients startDate');
      return client;
    }
  };
};
