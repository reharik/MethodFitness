import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../../ContentHeader';
import { browserHistory } from 'react-router';
import ClientInventory from '../../ClientInventory';
import ClientInfo from './ClientInfo';

class UpdateClientForm extends Component {
  componentWillMount() {
    this.loadData();
  }

  loadData() {
    if (this.props.clientId) {
      this.props.fetchClientAction(this.props.clientId);
    }
  }
  render() {
    let model = this.props.model;
    return (
      <div className="form">
        <ContentHeader>
          <div className="form__header">
            <div className="form__header__left">
              <button
                className="contentHeader__button__new"
                title="New"
                onClick={() => browserHistory.push('/client')}
              />
            </div>
            <div className="form__header__center">
              <div className="form__header__center__title">Client</div>
            </div>
            <div className="form__header__right" />
          </div>
        </ContentHeader>
        <div className="form-scroll-inner">
          <div className="content-inner">
            <div className="flexRow">
              <div style={{ width: '500px' }}>
                <ClientInfo model={model} submit={this.props.updateClientInfo} />
              </div>
              <div>
                <ClientInventory inventory={this.props.inventory} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UpdateClientForm.propTypes = {
  clientId: PropTypes.string,
  model: PropTypes.object,
  inventory: PropTypes.object,
  notifications: PropTypes.func,
  states: PropTypes.array,
  sources: PropTypes.array,
  fetchClientAction: PropTypes.func,
  updateClientSource: PropTypes.func,
  updateClientInfo: PropTypes.func,
  updateClientContact: PropTypes.func,
  updateClientAddress: PropTypes.func
};

export default UpdateClientForm;
