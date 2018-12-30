import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../../ContentHeader';
import { browserHistory } from 'react-router';
import ClientInventory from '../../ClientInventory';
import ClientInfo from './ClientInfo';
import ClientContact from './ClientContact';
import ClientAddress from './ClientAddress';
import ClientSource from './ClientSource';
import { Row, Col } from 'antd';

class UpdateClientForm extends Component {
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
          <Row type="flex">
            <Col lg={12} sm={24}>
              <ClientInfo model={model} submit={this.props.updateClientInfo} />
              <ClientContact
                model={model}
                submit={this.props.updateClientContact}
              />
              <ClientAddress
                model={model}
                submit={this.props.updateClientAddress}
                states={this.props.states}
              />
              <ClientSource
                model={model}
                submit={this.props.updateClientSource}
                sources={this.props.sources}
              />
            </Col>
            <Col xl={6} lg={10} sm={24}>
              <ClientInventory
                clientId={this.props.clientId}
                inventory={this.props.inventory}
              />
            </Col>
          </Row>
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
  updateClientAddress: PropTypes.func,
};

export default UpdateClientForm;
