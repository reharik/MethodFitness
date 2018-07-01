import cellLink from './../../../components/GridElements/CellLink.js';
import emailLink from './../../../components/GridElements/EmailLink.js';
import archiveLink from './../../../components/GridElements/ArchiveLink.js';

export default size => {
  switch (size) {
    case 'mobile': {
      return () => [
        {
          render: (column, row) => {
            return cellLink('trainer')(column, row, 'trainerId');
          },
          dataIndex: 'contact.lastName',
          title: 'Last Name',
          width: '10%',
          sorter: true,
        },
        {
          dataIndex: 'contact.firstName',
          title: 'First Name',
          width: '10%',
        },
        {
          render: (value, row) => {
            // eslint-disable-line no-unused-vars
            return cellLink(`payTrainer`)('$$$', row, 'trainerId');
          },
          title: '$',
          width: '10%',
        },
      ];
    }
    default: {
      return (archiveTrainer, loggedInUser) => [
        {
          render: (column, row) => {
            return cellLink('trainer', 'trainerId')(column, row);
          },
          dataIndex: 'contact.lastName',
          title: 'Last Name',
          width: '10%',
          sorter: true,
        },
        {
          dataIndex: 'contact.firstName',
          title: 'First Name',
          width: '10%',
        },
        {
          render: emailLink,
          dataIndex: 'contact.email',
          title: 'Email',
          width: '35%',
        },
        {
          dataIndex: 'contact.mobilePhone',
          title: 'Mobile Phone',
          width: '10%',
        },
        {
          render: (column, row) => {
            return archiveLink(archiveTrainer, loggedInUser, 'trainerId')(
              column,
              row,
            );
          },
          dataIndex: 'archived',
          title: 'Archived',
          width: '10%',
        },
        {
          render: (value, row) => {
            // eslint-disable-line no-unused-vars
            return cellLink(`payTrainer`, 'trainerId')('$$$', row);
          },
          title: '$',
          width: '10%',
        },
      ];
    }
  }
};
