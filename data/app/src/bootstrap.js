module.exports = function(migration,seedES) {
  return async function () {
    let wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    await migration(true);
    await wait(1000)
    await seedES();
  };
};
