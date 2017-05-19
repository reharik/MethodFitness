import { connect } from 'react-redux';
import TrainerList from '../../components/lists/TrainerList';
import cellLink from '../../components/GridElements/CellLink.js';
import emailLink from '../../components/GridElements/EmailLink.js';
import archiveLink from '../../components/GridElements/ArchiveLink.js';

import { fetchAllTrainersAction, archiveTrainer } from './../../modules/trainerModule';

const columns = archiveTrainer => [
  {
    property: ({ column, row }) => { // eslint-disable-line no-unused-vars
      return cellLink('trainer')({ value: `${row.contact.lastName}`, row });
    },
    sort: 'lastName',
    display: 'Last Name',
    width: '10%'
  },
  {
    property: 'contact.firstName',
    display: 'First Name',
    width: '10%'
  },
  {
    property: emailLink,
    propertyName: 'contact.email',
    display: 'Email',
    width: '35%'
  },
  {
    property: 'contact.mobilePhone',
    display: 'Mobile Phone',
    width: '10%'
  },
  {
    property: ({ column, row }) => { // eslint-disable-line no-unused-vars
      return archiveLink(archiveTrainer)({ value: `${row.archived}`, row });
    },
    sort: 'Archived',
    display: 'Archived',
    width: '10%'
  },
  {
    property: 'id',
    hidden: true
  }
];

function mapStateToProps(state) {
  const gridConfig = {
    tableName: 'trainerList',
    dataSource: 'trainers',
    fetchDataAction: fetchAllTrainersAction
  };
  return {
    gridConfig,
    columns,
    trainers: state.trainers
  };
}

export default connect(mapStateToProps, { archiveTrainer })(TrainerList);
