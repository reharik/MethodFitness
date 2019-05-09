const clients = (
  mssql,
  eventstore,
  notificationListener,
  notificationParser,
  uuid,
  commands,
  rsRepository
) => {
  return async () => {
    mssql = await mssql;

    const results = await mssql.query`select * from client`;

    //   `select distinct c.*
    // from client c inner join Appointment_Client ac on c.entityId = ac.clientId
    // inner join Appointment a on a.EntityId = ac.AppointmentId
    // where convert(datetime, a.Date) > CONVERT(datetime, '2/1/2018')`;

    rsRepository = await rsRepository;
    const defaultClientRates = await rsRepository.query('select * from "defaultClientRates"');

    const lastId = results.recordset[results.recordset.length - 1].EntityId;
    for (let x of results.recordset) {
      const clientCommand = commands.addClientCommand({
        source: x.Source,
        startDate: x.StartDate,
        sourceNotes: x.Notes,
        birthDate: x.BirthDate,
        archived: x.Archived,
        legacyId: x.EntityId,
        contact: {
          firstName: x.FirstName,
          lastName: x.LastName,
          mobilePhone: x.MobilePhone,
          secondaryPhone: x.SecondaryPhone,
          email: x.Email,
          address: {
            street1: x.Address1,
            street2: x.Address2,
            city: x.City,
            state: x.State,
            zipCode: x.ZipCode,
          },
        },
        clientRates: defaultClientRates[0],

        createdDate: x.CreatedDate,
        createdById: x.CreatedById,
        migration: true,
      });
      try {
        let continuationId = uuid.v4();
        let notificationPromise;
        if (x.EntityId === lastId) {
          notificationPromise = await notificationListener(continuationId);
        }
        await eventstore.commandPoster(
          clientCommand,
          'addClient',
          continuationId,
        );
        if (x.EntityId === lastId) {
          const result = await notificationParser(notificationPromise);
          console.log(`==========result==========`);
          console.log(result);
          console.log(`==========END result==========`);
        }
      } catch (ex) {
        console.log(`==========ex==========`);
        console.log(ex);
        console.log(`==========END ex==========`);
      }
    }
    console.log(`==========rows==========`);
    console.log(results.rowsAffected);
    console.log(`==========END rows==========`);
  };
};

module.exports = clients;


/*
* exclude 155
156
173
* */
