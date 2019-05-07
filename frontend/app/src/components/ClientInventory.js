import React from 'react';
import PropTypes from 'prop-types';
import DisplayFor from './formElements/DisplayFor';
import { Link } from 'react-router-dom';
import { Card, Row } from 'antd';

const ClientInventory = ({ inventory, clientId }) => {
  if (!inventory) {
    return null;
  }

  const invModel = {
    fullHour: {
      name: 'fullHour',
      type: 'number',
      value: inventory.fullHour || 0,
      label: 'Full Hour',
    },
    halfHour: {
      name: 'halfHour',
      type: 'number',
      value: inventory.halfHour || 0,
      label: 'Half Hour',
    },
    halfHourPair: {
      name: 'halfHourPair',
      type: 'number',
      value: inventory.halfHourPair || 0,
      label: 'Half Hour Pair',
    },
    pair: {
      name: 'pair',
      type: 'number',
      value: inventory.pair || 0,
      label: 'Pair',
    },
    fullHourGroup: {
      name: 'fullHourGroup',
      type: 'number',
      value: inventory.fullHourGroup || 0,
      label: 'Full Hour Group',
    },
    halfHourGroup: {
      name: 'halfHourGroup',
      type: 'number',
      value: inventory.halfHourGroup || 0,
      label: 'Half Hour Group',
    },
    fortyFiveMinute: {
      name: 'fortyFiveMinute',
      type: 'number',
      value: inventory.fortyFiveMinute || 0,
      label: 'Forty Five Minute',
    },
  };

  return (
    <Card
      title="Current Client Inventory"
      data-id={'clientInventory'}
      extra={
        <Link data-id={'purchases'} to={`/purchases/${clientId}`}>
          Purchases
        </Link>
      }
    >
      {invModel.fullHour.value !== 0 ? (
        <Row type="flex" style={{ alignItems: 'center' }}>
          <DisplayFor span={10} data={invModel.fullHour} />
        </Row>
      ) : null}
      {invModel.halfHour.value !== 0 ? (
        <Row type="flex">
          <DisplayFor data={invModel.halfHour} />
        </Row>
      ) : null}
      {invModel.pair.value !== 0 ? (
        <Row type="flex">
          <DisplayFor data={invModel.pair} />
        </Row>
      ) : null}
      {invModel.halfHourPair.value !== 0 ? (
        <Row type="flex">
          <DisplayFor data={invModel.halfHourPair} />
        </Row>
      ) : null}
      {invModel.fullHourGroup.value !== 0 ? (
        <Row type="flex">
          <DisplayFor data={invModel.fullHourGroup} />
        </Row>
      ) : null}
      {invModel.halfHourGroup.value !== 0 ? (
        <Row type="flex">
          <DisplayFor data={invModel.halfHourGroup} />
        </Row>
      ) : null}
      {invModel.fortyFiveMinute.value !== 0 ? (
        <Row type="flex">
          <DisplayFor data={invModel.fortyFiveMinute} />
        </Row>
      ) : null}
    </Card>
  );
};

ClientInventory.propTypes = {
  clientId: PropTypes.string,
  inventory: PropTypes.object,
};

export default ClientInventory;
