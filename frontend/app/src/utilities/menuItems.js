export default role => {
  const items = [
    { text: 'Calendar', path: '/calendar' },
    {
      text: 'Locations',
      path: '/locations',
      role: 'admin',
    },
    {
      text: 'Trainers',
      path: '/trainers',
      role: 'admin',
    },
    { text: 'Clients', path: '/clients' },
    {
      text: 'Default Client Rates',
      path: '/defaultClientRates',
      role: 'admin',
    },
    {
      text: 'Trainer Verification',
      path: '/verification',
    },
    {
      text: 'Payment History',
      path: '/trainerPayments',
    },
  ];
  if (role === 'admin') {
    return items;
  } else {
    return items.filter(x => x.role !== 'admin');
  }
};
