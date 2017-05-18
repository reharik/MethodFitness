module.exports = function(invariant) {
  return function (client) {
    invariant(client.contact.firstName, 'addClient requires that you pass the clients first name');
    invariant(client.contact.lastName, 'addClient requires that you pass the clients last name');
    invariant(client.contact.email, 'addClient requires that you pass the clients email');
    invariant(client.contact.mobilePhone, 'addClient requires that you pass the clients mobilePhone');
    invariant(client.startDate, 'addClient requires that you pass the clients startDate');
    return client
  }
};