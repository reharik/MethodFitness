import React from 'react';
import { connect } from 'react-redux';
import TrainerPaidItemList from '../../components/lists/TrainerPaidItemList';
import moment from 'moment';

const columns = [
  {
    dataIndex: 'clientName',
    title: 'Client Name',
    width: '20%'
  },
  {
    dataIndex: 'appointmentDate',
    title: 'Date',
    width: '20%'
  },
  {
    dataIndex: 'appointmentStartTime',
    title: 'Start Time',
    width: '15%'
  },
  {
    dataIndex: 'appointmentType',
    title: 'Type',
    width: '15%'
  },
  {
    dataIndex: 'pricePerSession',
    title: 'Cost',
    width: '10%'
  },
  {
    dataIndex: 'trainerPercentage',
    title: 'Percent',
    width: '10%'
  },
  {
    dataIndex: 'trainerPay',
    title: 'Pay',
    width: '10%'
  }
];

function mapStateToProps(state, props) {
  moment.locale('en');
  let dataSource = state.trainerPayment[props.params.id]
    .map(x => ({
      ...x,
      appointmentDate: moment(x.appointmentDate).format('MM/DD/YYYY'),
      appointmentStartTime: moment(x.appointmentStartTime).format('hh:mm A')
    }));

  const gridConfig = {
    columns,
    dataSource
  };
  return {
    gridConfig
  };
}

export default connect(mapStateToProps)(TrainerPaidItemList);
