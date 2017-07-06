module.exports = function(migration,seedES) {
  return async function () {
    let wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    await migration(true);
    await wait(2000);
    console.log(`=========="after wait"=========`);
    console.log("after wait");
    console.log(`==========END "after wait"=========`);
    await seedES();
  };
};
