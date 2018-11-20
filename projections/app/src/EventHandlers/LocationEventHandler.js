/**
 * Created by parallels on 7/16/15.
 */

module.exports = function(rsRepository, moment, metaLogger, logger) {
  return function LocationEventHandler() {
    logger.info('LocationEventHandler started up');
    async function locationAdded(event) {
      rsRepository = await rsRepository;
      let location = {
        locationId: event.locationId,
        legacyId: event.legacyId,
        name: event.name,
      };
      return await rsRepository.save('location', location, location.locationId);
    }

    async function locationUpdated(event) {
      rsRepository = await rsRepository;
      let location = await rsRepository.getById(event.locationId, 'location');
      location.name = event.name;
      return await rsRepository.save('location', location, location.locationId);
    }

    async function locationArchived(event) {
      rsRepository = await rsRepository;
      let location = await rsRepository.getById(event.locationId, 'location');
      location.archived = true;
      location.archivedDate = event.date;
      let sql = `UPDATE "location" SET "archived" = 'true', document = '${JSON.stringify(
        location,
      )}' 
where id = '${event.locationId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function locationUnarchived(event) {
      rsRepository = await rsRepository;
      let location = await rsRepository.getById(event.locationId, 'location');
      location.archived = false;
      location.archivedDate = event.date;
      let sql = `UPDATE "location" SET "archived" = 'false', document = '${JSON.stringify(
        location,
      )}' 
where id = '${event.locationId}'`;
      return await rsRepository.saveQuery(sql);
    }

    return metaLogger(
      {
        handlerName: 'LocationEventHandler',
        locationAdded,
        locationArchived,
        locationUnarchived,
        locationUpdated,
      },
      'LocationEventHandler',
    );
  };
};
