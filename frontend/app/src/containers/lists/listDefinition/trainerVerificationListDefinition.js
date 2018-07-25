export default size => {
  switch (size) {
    case 'mobile': {
      return [
        {
          dataIndex: 'clientName',
          title: 'Client Name',
        },
        {
          dataIndex: 'appointmentDate',
          title: 'Date',
        },
        {
          dataIndex: 'appointmentType',
          title: 'Type',
        },
      ];
    }
    default: {
      return [
        {
          dataIndex: 'clientName',
          title: 'Client Name',
          width: '20%',
        },
        {
          dataIndex: 'appointmentDate',
          title: 'Date',
          width: '20%',
        },
        {
          dataIndex: 'startTime',
          title: 'Start Time',
          width: '15%',
        },
        {
          dataIndex: 'appointmentType',
          title: 'Type',
          width: '15%',
        },
        {
          render: val => (val ? `$${val}` : val), // eslint-disable-line no-confusing-arrow
          dataIndex: 'pricePerSession',
          title: 'Cost',
          width: '10%',
        },
        {
          render: val => (val ? `${val}%` : val), // eslint-disable-line no-confusing-arrow
          dataIndex: 'trainerPercentage',
          title: 'Percent',
          width: '10%',
        },
        {
          render: val => (val ? `$${val}` : val), // eslint-disable-line no-confusing-arrow
          dataIndex: 'trainerPay',
          title: 'Pay',
          width: '10%',
        },
      ];
    }
  }
};
