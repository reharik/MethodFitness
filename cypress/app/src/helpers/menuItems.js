export default role => {
  const items = [
    { text: 'Calendar', path: '/calendar' },
    {
      text: 'Trainers',
      path: '/trainers',
      role: 'admin',
    },
    { text: 'Clients', path: '/clients' },
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
