import cellLink from './../../../components/GridElements/CellLink.js';
import emailLink from './../../../components/GridElements/EmailLink.js';
import archiveLink from './../../../components/GridElements/ArchiveLink.js';

export default (size, isAdmin) => {
  switch (size) {
    case 'mobile': {
      return () => [
        {
          render: (value, row) => { // eslint-disable-line no-unused-vars
            return cellLink('client', 'clientId')(value, row);
          },
          dataIndex: 'contact.lastName',
          title: 'Last Name',
          width: '10%'
        },
        {
          dataIndex: 'contact.firstName',
          title: 'First Name',
          width: '10%'
        },
        {
          render: (value, row) => { // eslint-disable-line no-unused-vars
            return cellLink(`purchases`, 'clientId')('$$$', row);
          },
          title: '$',
          width: '10%'
        }
      ];
    }
    default: {
      if(isAdmin) {
        return archiveClient => [
          {
            render: (value, row) => { // eslint-disable-line no-unused-vars
              return cellLink('client', 'clientId')(value, row);
            },
            dataIndex: 'contact.lastName',
            title: 'Last Name',
            width: '10%'
          },
          {
            dataIndex: 'contact.firstName',
            title: 'First Name',
            width: '10%'
          },
          {
            render: emailLink,
            dataIndex: 'contact.email',
            title: 'Email',
            width: '35%'
          },
          {
            dataIndex: 'contact.mobilePhone',
            title: 'Mobile Phone',
            width: '10%'
          },
          {
            render: (value, row) => { // eslint-disable-line no-unused-vars
              return archiveLink(archiveClient, 'clientId')(value, row);
            },
            dataIndex: 'archived',
            title: 'Archived',
            width: '10%'
          },
          {
            render: (value, row) => { // eslint-disable-line no-unused-vars
              return cellLink(`purchases`, 'clientId')('$$$', row);
            },
            title: '$',
            width: '10%'
          }
        ];
      }
      return () => [
        {
          render: (value, row) => { // eslint-disable-line no-unused-vars
            return cellLink('client', 'clientId')(value, row);
          },
          dataIndex: 'contact.lastName',
          title: 'Last Name',
          width: '10%'
        },
        {
          dataIndex: 'contact.firstName',
          title: 'First Name',
          width: '10%'
        },
        {
          render: emailLink,
          dataIndex: 'contact.email',
          title: 'Email',
          width: '35%'
        },
        {
          dataIndex: 'contact.mobilePhone',
          title: 'Mobile Phone',
          width: '10%'
        },
        {
          render: (value, row) => { // eslint-disable-line no-unused-vars
            return cellLink(`purchases`, 'clientId')('$$$', row);
          },
          title: '$',
          width: '10%'
        }
      ];
    }
  }
};
