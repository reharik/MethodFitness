const clients = (mssql, eventstore, uuid, commands) => {
  return async () => {
    mssql = await mssql;

    const results = await mssql.query`select distinct c.* 
    from client c inner join Appointment_Client ac on c.entityId = ac.clientId
	  inner join Appointment a on a.EntityId = ac.AppointmentId 
    where convert(datetime, a.Date) > CONVERT(datetime, '2/1/2018')`;
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
        createdDate: x.createdDate,
        createdById: x.createdById,
        migration: true
      });
      try {
        await eventstore.commandPoster(clientCommand, 'addClient', uuid.v4());
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
