export function denormalizeContact(flat) {
  return {
    firstName: flat.firstName,
    lastName: flat.lastName,
    email: flat.email,
    secondaryPhone: flat.secondaryPhone,
    mobilePhone: flat.mobilePhone,
    address: {
      street1: flat.street1,
      street2: flat.street2,
      city: flat.city,
      state: flat.state,
      zipCode: flat.zipCode,
    },
  };
}

export function denormalizeTrainer(flat) {
  return {
    color: flat.color,
    birthDate: flat.birthDate,
    contact: denormalizeContact(flat),
    clients: flat.clients,
    defaultTrainerClientRate: flat.defaultTrainerClientRate,
    credentials: {
      password: flat.password,
      role: flat.role,
    },
    trainerClientRates: flat.trainerClientRates,
  };
}

export function denormalizeClientRates(flat) {
  return {
    fullHourTenPack: flat.fullHourTenPack,
    fullHour: flat.fullHour,
    halfHourTenPack: flat.halfHourTenPack,
    halfHour: flat.halfHour,
    pairTenPack: flat.pairTenPack,
    pair: flat.pair,
    halfHourPairTenPack: flat.halfHourPairTenPack,
    halfHourPair: flat.halfHourPair,
    fullHourGroupTenPack: flat.fullHourGroupTenPack,
    fullHourGroup: flat.fullHourGroup,
    halfHourGroupTenPack: flat.halfHourGroupTenPack,
    halfHourGroup: flat.halfHourGroup,
    fortyFiveMinuteTenPack: flat.fortyFiveMinuteTenPack,
    fortyFiveMinute: flat.fortyFiveMinute,
  };
}

export function denormalizeClient(flat) {
  return {
    source: flat.source,
    sourceNotes: flat.sourceNotes,
    startDate: flat.startDate,
    birthDate: flat.birthDate,
    addClientToCreator: flat.addClientToCreator,
    contact: denormalizeContact(flat),
    clientRates: denormalizeClientRates(flat),
  };
}
