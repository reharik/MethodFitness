import React from 'react';
import PropTypes from 'prop-types';
import DisplayFor from './formElements/elementsFor/DisplayFor';

const ClientInventory = ({ inventory }) => {
  if (!inventory) {
    return null;
  }
  const invModel = {
    fullHour: {
      name: 'fullHour',
      type: 'number',
      value: inventory.fullHours || 0,
      label: 'Full Hour'
    },
    halfHour: {
      name: 'halfHour',
      type: 'number',
      value: inventory.halfHours || 0,
      label: 'Half Hour'
    },
    pair: {
      name: 'pair',
      type: 'number',
      value: inventory.pairs || 0,
      label: 'Pair'
    }
  };

  return (
    <div className="form__section__header">
      <label className="form__section__header__label">Current Client Inventory</label>
      <hr />
      <div className="form__section__row">
        <DisplayFor data={invModel.fullHour} />
      </div>
      <div className="form__section__row">
        <DisplayFor data={invModel.halfHour} />
      </div>
      <div className="form__section__row">
        <DisplayFor data={invModel.pair} />
      </div>
    </div>
  );
};

ClientInventory.propTypes = {
  inventory: PropTypes.object
};

export default ClientInventory;
