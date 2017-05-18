import {connect} from 'react-redux';
import ClientList from '../../components/lists/ClientList';
import CellLink from '../../components/GridElements/CellLink.js';
import EmailLink from '../../components/GridElements/EmailLink.js';
import ArchiveLink from '../../components/GridElements/ArchiveLink.js';

import { fetchAllClientsAction, archiveClient } from './../../modules/clientModule';

const columns = (archiveClient) => [
  {
    property: ({column, row}) => {
      return CellLink('client')({value: `${row.contact.lastName}`, row})
    },
    sort:'lastName',
    display: 'Last Name',
    width: '10%',
  },
  {
    property: 'contact.firstName',
    display: 'First Name',
    width: '10%',
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
    width: '10%',
  },
  {
    property: ({column, row}) => {
      return ArchiveLink(archiveClient)({value: `${row.archived}`, row})
    },
    sort:'Archived',
    display: 'Archived',
    width: '10%',
  },
  {
    property:({column, row}) => {
      return CellLink(`purchases`)({value: '$$$', row})
    },
    display: '$',
    width: '10%'
  },
  {
    property: 'id',
    hidden : true
  }
];


function mapStateToProps(state) {
  const gridConfig = {
    tableName: 'clientList',
    dataSource: 'clients',
    fetchDataAction: fetchAllClientsAction,
  };
  return {
    gridConfig,
    columns,
    clients: state.clients.sort((a, b) => {
      const _a = a.contact.lastName.toLowerCase();
      const _b = b.contact.lastName.toLowerCase();
      if ( _a > _b) {
        return 1
      }
      if (_a < _b ) {
        return -1
      }
      return 0;
    })

  }
}

export default connect(mapStateToProps, {archiveClient})(ClientList);

