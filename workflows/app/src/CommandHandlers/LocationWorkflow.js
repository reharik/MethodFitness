module.exports = function(eventRepository, metaLogger, logger, location) {
  return function LocationWorkflow() {
    async function addLocation(cmd, continuationId) {
      let locationInstance = location();
      locationInstance.addLocation(cmd);

      logger.info('saving locationInstance');
      logger.trace(locationInstance);

      await eventRepository.save(locationInstance, { continuationId });
      return { locationId: locationInstance.state._id };
    }

    async function updateLocation(cmd, continuationId) {
      let locationInstance = await eventRepository.getById(
        location,
        cmd.locationId,
      );
      locationInstance.updateLocation(cmd);

      logger.info('saving locationInstance');
      logger.trace(locationInstance);

      await eventRepository.save(locationInstance, { continuationId });
      return { locationId: locationInstance.state._id };
    }

    async function archiveLocation(cmd, continuationId) {
      let locationInstance = await eventRepository.getById(
        location,
        cmd.locationId,
      );
      locationInstance.archiveLocation(cmd);

      logger.info('saving locationInstance');
      logger.trace(locationInstance);

      await eventRepository.save(locationInstance, { continuationId });
      return { locationId: locationInstance.state._id };
    }

    async function unArchiveLocation(cmd, continuationId) {
      let locationInstance = await eventRepository.getById(
        location,
        cmd.locationId,
      );
      locationInstance.unArchiveLocation(cmd);

      logger.info('saving locationInstance');
      logger.trace(locationInstance);

      await eventRepository.save(locationInstance, { continuationId });
      return { locationId: locationInstance.state._id };
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
