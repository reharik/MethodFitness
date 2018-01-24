import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../../ContentHeader';
import { browserHistory } from 'react-router';
import TrainerInfo from './TrainerInfo';
import TrainerContact from './TrainerContact';
import TrainerAddress from './TrainerAddress';
import TrainerPassword from './TrainerPassword';
import TrainerClientRates from './TrainerClientRates';
import TrainerClients from './TrainerClients';
import { Row, Col } from 'antd';

class UpdateTrainerForm extends Component {
  componentDidMount() {
    this.loadData();
  }

  loadData() {
    if (this.props.params.trainerId) {
      this.props.fetchTrainerAction(this.props.params.trainerId);
      this.props.getTrainerClientRates(this.props.params.trainerId);
    }
    this.props.fetchClientsAction();
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
                onClick={() => browserHistory.push('/trainer')}
              />
            </div>
            <div className="form__header__center">
              <div className="form__header__center__title">Trainer</div>
            </div>
            <div className="form__header__right" />
          </div>
        </ContentHeader>
        <div className="form-scroll-inner">
          <Row type="flex">
            <Col xl={10} lg={18} sm={24} >
              <TrainerContact model={model} submit={this.props.updateTrainerContact} />
              <TrainerInfo model={model} submit={this.props.updateTrainerInfo} />
              <TrainerAddress model={model} submit={this.props.updateTrainerAddress} states={this.props.states} />
              <TrainerPassword model={model} submit={this.props.updateTrainerPassword} roles={this.props.roles} />
              <TrainerClients model={model} submit={this.props.updateTrainersClients} clients={this.props.clients} />
              <TrainerClientRates model={model} submit={this.props.updateTrainersClientRate} />
            </Col>
          </Row>
        </div>
      </div>);
  }
}

UpdateTrainerForm.propTypes = {
  params: PropTypes.object,
  model: PropTypes.object,
  roles: PropTypes.array,
  states: PropTypes.array,
  clients: PropTypes.array,
  updateTrainersClientRate: PropTypes.func,
  updateTrainersClients: PropTypes.func,
  fetchTrainerAction: PropTypes.func,
  fetchClientsAction: PropTypes.func,
  updateTrainerInfo: PropTypes.func,
  updateTrainerContact: PropTypes.func,
  updateTrainerAddress: PropTypes.func,
  updateTrainerPassword: PropTypes.func,
  getTrainerClientRates: PropTypes.func
};

export default UpdateTrainerForm;
