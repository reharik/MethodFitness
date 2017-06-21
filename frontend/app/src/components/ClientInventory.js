import React from 'react';
import PropTypes from 'prop-types';
import DisplayFor from './formElements/DisplayFor';
import { Card, Row } from 'antd';

const ClientInventory = ({ inventory }) => {
  if (!inventory) {
    return null;
  }
  const invModel = {
    fullHour: {
      name: 'fullHour',
      type: 'number',
      value: inventory.fullHour || 0,
      label: 'Full Hour'
    },
    halfHour: {
      name: 'halfHour',
      type: 'number',
      value: inventory.halfHour || 0,
      label: 'Half Hour'
    },
    pair: {
      name: 'pair',
      type: 'number',
      value: inventory.pair || 0,
      label: 'Pair'
    }
  };

  return (
    <Card title="Current Client Inventory">
      <Row type="flex">
        <DisplayFor data={invModel.fullHour} />
      </Row>
      <Row type="flex">
        <DisplayFor data={invModel.halfHour} />
      </Row>
      <Row type="flex">
        <DisplayFor data={invModel.pair} />
      </Row>
    </Card>
  );
};

ClientInventory.propTypes = {
  inventory: PropTypes.object
};

export default ClientInventory;
