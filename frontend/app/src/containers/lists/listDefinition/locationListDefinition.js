import cellLink from './../../../components/GridElements/CellLink.js';
import archiveLink from './../../../components/GridElements/ArchiveLink.js';

export default () => {
  return archiveLocation => [
    {
      render: (value, row) => {
        // eslint-disable-line no-unused-vars

        return cellLink('location', 'locationId')(value, row);
      },
      dataIndex: 'name',
      title: 'Name',
      width: '10%',
    },
    {
      render: (value, row) => {
        // eslint-disable-line no-unused-vars
        return archiveLink(archiveLocation, null, 'locationId')(value, row);
      },
      dataIndex: 'archived',
      title: 'Archived',
      width: '10%',
    },
    {
      render: (value, row) => {
        // eslint-disable-line no-unused-vars
        return cellLink(`purchases`, 'locationId')('$$$', row);
      },
      title: '$',
      width: '10%',
    },
  ];
};
