import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../ContentHeader';
import EditableFor from './../formElements/elementsFor/EditableFor';
import EditableDisplay from './../forms/editableDisplay/EditableDisplay';
import {browserHistory} from 'react-router';

class UpdateTrainerForm extends Component {
  componentWillMount() {
    this.loadData();
  }

  loadData() {
    // this.props.notifClear('appointmentForm');

    if (this.props.params.trainerId) {
      this.props.fetchTrainerAction(this.props.params.trainerId);
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
          <div className="content-inner">
            <div className="flexRow">
              <div>
                <EditableDisplay
                  model={this.props.model}
                  submitHandler={this.props.updateTrainerInfo}
                  sectionHeader="Trainer Info"
                  formName="TrainerInfo"
                  notifications={this.props.notifications}
                >
                  <div className="editableDisplay__content__form__row">
                    <EditableFor data="firstName" />
                    <EditableFor data="lastName" />
                  </div>
                  <div className="editableDisplay__content__form__row">
                    <EditableFor data="birthDate" />
                    <EditableFor data="color" />
                  </div>
                </EditableDisplay>
                <EditableDisplay
                  model={this.props.model}
                  submitHandler={this.props.updateTrainerContact}
                  sectionHeader="Trainer Contact"
                  formName="TrainerContact"
                  notifications={this.props.notifications}
                >
                  <div className="editableDisplay__content__form__row">
                    <EditableFor data="mobilePhone" />
                    <EditableFor data="secondaryPhone" />
                  </div>
                  <div className="editableDisplay__content__form__row__single">
                    <EditableFor data="email" />
                  </div>
                </EditableDisplay>
                <EditableDisplay
                  model={this.props.model}
                  submitHandler={this.props.updateTrainerAddress}
                  sectionHeader="Trainer Address"
                  formName="TrainerAddress"
                  notifications={this.props.notifications}
                >
                  <div className="editableDisplay__content__form__row">
                    <EditableFor data="street1" />
                  </div>
                  <div className="editableDisplay__content__form__row">
                    <EditableFor data="street2" />
                  </div>
                  <div className="editableDisplay__content__form__row">
                    <EditableFor data="city" containerStyle="editableDisplay__content__form__row__address__city" />
                    <EditableFor
                      selectOptions={this.props.states}
                      data="state"
                      containerStyle="editableDisplay__content__form__row__address__state"
                    />
                    <EditableFor data="zipCode" containerStyle="editableDisplay__content__form__row__address__zip" />
                  </div>
                </EditableDisplay>
                <EditableDisplay
                  model={this.props.model}
                  submitHandler={this.props.updateTrainerPassword}
                  sectionHeader="Trainer Password"
                  formName="TrainerPassword"
                  notifications={this.props.notifications}
                >
                  <div className="editableDisplay__content__form__row">
                    <EditableFor data="password" noDisplay="true" />
                  </div>
                  <div className="editableDisplay__content__form__row">
                    <EditableFor data="confirmPassword" noDisplay="true" />
                  </div>
                  <div className="editableDisplay__content__form__row">
                    <EditableFor data="role" noDisplay="true" selectOptions={this.props.roles} />
                  </div>
                </EditableDisplay>
              </div>
              <div>
                <EditableDisplay
                  model={this.props.model}
                  submitHandler={this.props.updateTrainersClients}
                  sectionHeader="Trainer's Clients"
                  formName="TrainersClients"
                  notifications={this.props.notifications}
                >
                  <div className="editableDisplay__content__form__row">
                    <EditableFor selectOptions={this.props.clients} data="clients" />
                  </div>
                </EditableDisplay>
                <EditableDisplay
                  model={this.props.model}
                  submitHandler={this.props.updateTrainersClientRate}
                  sectionHeader="Trainer's Client Rate"
                  formName="TrainersClientRate"
                  notifications={this.props.notifications}
                >
                  <div className="editableDisplay__content__form__row">
                    <EditableFor data="trainerClientRates" horizontal="true" />
                  </div>
                </EditableDisplay>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UpdateTrainerForm.propTypes = {
  params: PropTypes.object,
  model: PropTypes.object,
  roles: PropTypes.array,
  notifications: PropTypes.func,
  states: PropTypes.array,
  clients: PropTypes.array,
  updateTrainersClientRate: PropTypes.func,
  updateTrainersClients: PropTypes.func,
  fetchTrainerAction: PropTypes.func,
  fetchClientsAction: PropTypes.func,
  updateTrainerInfo: PropTypes.func,
  updateTrainerContact: PropTypes.func,
  updateTrainerAddress: PropTypes.func,
  updateTrainerPassword: PropTypes.func
};

export default UpdateTrainerForm;
