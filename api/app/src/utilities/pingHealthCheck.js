module.exports = function(rsRepository, promiseretry) {
  const ping = healthCheckId => {
    return new Promise((res, rej) => {
      rsRepository
        .saveQuery(`select * from "helathcheck" where "id" ='${healthCheckId}'`)
        .then(result => {
          if (result && result.rows.length > 0 && result.rows[0].healthCheck) {
            res(result.row[0].healthCheck);
          } else {
            rej(false);
          }
        });
    });
  };
  return healthCheckId => {
    return promiseretry((retry, number) => {
      console.log('attempt number', number);
      return ping(healthCheckId).catch(retry);
    }, {retries: 4});
  };
};
