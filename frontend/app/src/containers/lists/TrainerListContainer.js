import { connect } from 'react-redux';
import TrainerList from '../../components/lists/TrainerList';
import CellLink from '../../components/GridElements/CellLink.js';
import EmailLink from '../../components/GridElements/EmailLink.js';
import ArchiveLink from '../../components/GridElements/ArchiveLink.js';

import { fetchAllTrainersAction, archiveTrainer } from './../../modules/trainerModule';

const columns = archiveTrainer => [
  {
    property: ({ column, row }) => {
      return CellLink('trainer')({ value: `${row.contact.lastName}`, row });
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
    property: EmailLink,
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
    property: ({ column, row }) => {
      return ArchiveLink(archiveTrainer)({ value: `${row.archived}`, row });
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
