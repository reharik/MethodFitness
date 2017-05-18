import React from 'react';
import { Table } from '../../src/index';
import Promise from 'bluebird';
import uuid from 'uuid';

export default () => {
//example of custom component rendering
  const EmailLink = ({column, value, row}) => (
    <div>
      <a href={'mailto:' + value}>{value}</a>
    </div>);

  const columns= [
    {
      property:'firstName',
      display:'First Name',
      width: '100px',
      className: 'additional-class',
      headerClassName: 'someHeaderName',
      format: ({column, value, row}) => {
        return (
          <span> Name: { value } </span>
        );
      },
      hidden: false
    },
    {
      sort:true,
      property:'lastName',
      display:'Last Name',
      width: '100px',
      className: 'additional-class',
      headerClassName: 'someHeaderName',
      format: ({ column, value, row }) => {
        return (
          <span> Name: { value } </span>
        );
      },
      hidden: false
    },
    {
      property: 'email',
      display: 'Email',
      width: '100px',
      className: 'additional-class',
      headerClassName: 'someHeaderName',
      format: EmailLink,
      headerFormat: ({ column, value, row }) => {
        return (<div style={{color:"Red"}} >value</div>);
      },
      hidden: false
    },
    {
      property: 'age',
      sort:true
    },
    {
      property:'id',
      hidden: true
    }
  ];

  const testData = [
    {
      firstName:'Raif', age:33, lastName:'Harik', email:'f@u.com', id:uuid.v4()
    },
    {
      firstName:'Robbie', age: 66, lastName:'Fuentes', email:'robbie@fuenties.com', id:uuid.v4()
    }
  ];

  const config = {
      bulkSelection: {
        mode:'single'
    },
    tableName: 'testTable',
    fetchDataAction: () => {
      return {
        type: "getData",
        data:testData
      };
    },
    dataSource: 'testData'
  };

  return (<div className="redux__datatable__app" >
    <Table config={config} columns={columns} />
  </div>);
};
