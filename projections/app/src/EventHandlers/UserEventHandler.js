module.exports = function(rsRepository, metaLogger, logger) {
  return function UserEventHandler() {
    logger.info('UserEventHandler started up');

    async function trainerHired(event) {
      rsRepository = await rsRepository;
      let user = {
        trainerId: event.trainerId,
        userName: event.contact.email,
        password: event.credentials.password,
        role: event.credentials.role,
        active: true,
      };

      return await rsRepository.save('user', user, user.trainerId);
    }

    async function trainerArchived(event) {
      rsRepository = await rsRepository;
      let user = await rsRepository.getById(event.trainerId, 'user');
      user.active = true;
      let sql = `UPDATE "user" SET "archived" = 'true', document = 
'${JSON.stringify(user)}' where id = '${event.trainerId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function trainerUnArchived(event) {
      rsRepository = await rsRepository;
      let user = await rsRepository.getById(event.id, 'user');
      user.active = false;

      let sql = `UPDATE "user" SET "archived" = 'false', document = 
'${JSON.stringify(user)}' where id = '${event.trainerId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function trainerContactUpdated(event) {
      rsRepository = await rsRepository;
      let user = await rsRepository.getById(event.trainerId, 'user');
      user.userName = event.contact.email;
      return await rsRepository.save('user', user, user.trainerId);
    }

    async function trainerPasswordUpdated(event) {
      rsRepository = await rsRepository;
      let user = await rsRepository.getById(event.trainerId, 'user');
      user.password = event.credentials.password;
      user.role = event.credentials.role;
      return await rsRepository.save('user', user, user.trainerId);
    }

    return metaLogger(
      {
        handlerName: 'UserEventHandler',
        trainerHired,
        trainerArchived,
        trainerUnArchived,
        trainerContactUpdated,
        trainerPasswordUpdated,
      },
      'UserEventHandler',
    );
  };
};
