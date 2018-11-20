module.exports = function(uuid, invariant) {
  return {
    locations: [
      {
        locationId: '9aee9b0f-e62f-4f91-b8cb-894dbf56963a',
        name: 'default',
      },
      {
        locationId: '6696ff7e-4f57-4233-92d1-3878d989c243',
        name: 'somewhere else',
      },
    ],

    addLocation: location => {
      invariant(
        location.name,
        'addLocation requires that you pass the locations name',
      );
      return location;
    },
  };
};
