import { connect } from 'react-redux';
import ClientForm from '../../components/forms/ClientForm';
import normalizeModel from './../../utilities/normalizeModel';
import states from './../../constants/states';
import sources from './../../constants/sources';
import { addClient } from './../../modules/clientModule';
import { fetchDefaultClientRates } from '../../modules/defaultClientRatesModule';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const ClientFormContainer = props => {
  useEffect(() => {
    props.fetchDefaultClientRates();
  }, []);

  return (
    <ClientForm
      model={props.model}
      states={props.states}
      sources={props.sources}
      isAdmin={props.isAdmin}
      addClient={props.addClient}
      defaultClientRates={props.defaultClientRates}
    />
  );
};

ClientFormContainer.propTypes = {
  model: PropTypes.object,
  addClient: PropTypes.func,
  states: PropTypes.array,
  sources: PropTypes.array,
  isAdmin: PropTypes.bool,
  fetchDefaultClientRates: PropTypes.func,
  defaultClientRates: PropTypes.object,
};

const mapStateToProps = state => {
  const model = normalizeModel(state.schema.definitions.client, {
    clientRates: state.defaultClientRates.results[0],
  });

  model.addClientToCreator.label = 'Add Client To Your Client List';
  model.addClientToCreator.value = true;

  return {
    model,
    states,
    sources,
    defaultClientRates: state.defaultClientRates.results[0],
    isAdmin: state.auth.user.role === 'admin',
  };
};

export default connect(
  mapStateToProps,
  { addClient, fetchDefaultClientRates },
)(ClientFormContainer);
