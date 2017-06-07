module.exports = function(invariant, loadTrainers, loadClients) {
  return {
    purchases: [
      {
        clientId: loadClients.clients[0].id,
        fullHour: 0,
        fullHourTenPack: 0,
        fullHourTenPackTotal: 0,
        fullHourTotal: 0,
        halfHour: 0,
        halfHourTenPack: 1,
        halfHourTenPackTotal: 0,
        halfHourTotal: 350,
        pair: 0,
        pairTenPack: 0,
        pairTenPackTotal: 0,
        pairTotal: 0,
        purchaseTotal: 350
      },
      {
        clientId: loadClients.clients[2].id,
        fullHour: 0,
        fullHourTenPack: 0,
        fullHourTenPackTotal: 0,
        fullHourTotal: 0,
        halfHour: 0,
        halfHourTenPack: 1,
        halfHourTenPackTotal: 0,
        halfHourTotal: 350,
        pair: 0,
        pairTenPack: 0,
        pairTenPackTotal: 0,
        pairTotal: 0,
        purchaseTotal: 350
      }],

    purchase: (purchase) => {
      invariant(purchase.clientId, `Purchase requires a client Id`);
      return purchase;
    }
  };
};
