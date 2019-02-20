module.exports = function(eventRepository, metaLogger, logger, location) {
  return function LocationWorkflow() {
    async function handleCommand(cmd, continuationId, funcName) {
      let locationInstance = await eventRepository.getById(
        location,
        cmd.locationId,
      );
      locationInstance[funcName](cmd);

      logger.info('saving locationInstance');
      logger.trace(JSON.stringify(locationInstance));

      await eventRepository.save(locationInstance, { continuationId });
      return { locationId: locationInstance.state._id };
    }

    async function addLocation(cmd, continuationId) {
      let locationInstance = location();
      locationInstance.addLocation(cmd);

      logger.info('saving locationInstance');
      logger.trace(JSON.stringify(locationInstance));

      await eventRepository.save(locationInstance, { continuationId });
      return { locationId: locationInstance.state._id };
    }

    async function updateLocation(cmd, continuationId) {
      return handleCommand(cmd, continuationId, 'updateLocation');
    }

    async function archiveLocation(cmd, continuationId) {
      return handleCommand(cmd, continuationId, 'archiveLocation');
    }

    async function unArchiveLocation(cmd, continuationId) {
      return handleCommand(cmd, continuationId, 'unArchiveLocation');
    }

    return metaLogger(
      {
        handlerName: 'LocationWorkflow',
        addLocation,
        updateLocation,
        archiveLocation,
        unArchiveLocation,
      },
      'LocationWorkflow',
    );
  };
};
