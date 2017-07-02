module.exports = function(migration,seedES) {
  return async function () {
    await migration(true);
    await seedES();
  };
};
