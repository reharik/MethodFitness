import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Notifs } from 'redux-notifications';
import ContentHeader from '../ContentHeader';
import { browserHistory } from 'react-router';
import SubmissionFor from './../formElements/SubmissionFor';
import { Form, Card, Row, Col } from 'antd';
import EditableFor from '../formElements/EditableFor';

class ClientFormInner extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(`==========values==========`);
        console.log(values);
        console.log(`==========END values==========`);

        if (!this.props.isAdmin) {
          values = { ...values, ...this.props.defaultClientRates };
        }
        this.props.addClient(values);
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const model = this.props.model;
    const form = this.props.form;

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
        <Notifs containerName="clientForm" />
        <div className="form-scroll-inner">
          <Form
            onSubmit={this.handleSubmit}
            className="form__content"
            layout="vertical"
          >
            <Row type="flex">
              <Col xl={10} lg={14} sm={24}>
                <Card title="Client Info">
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.firstName} />
                    <SubmissionFor form={form} data={model.lastName} />
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row type="flex">
              <Col xl={10} lg={14} sm={24}>
                <Card title="Contact Info">
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.mobilePhone} />
                    <SubmissionFor form={form} data={model.secondaryPhone} />
                  </Row>
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.email} />
                    <SubmissionFor form={form} data={model.birthDate} />
                  </Row>
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.street1} />
                    <SubmissionFor form={form} data={model.street2} />
                  </Row>
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.city} />
                    <SubmissionFor
                      span={8}
                      form={form}
                      selectOptions={this.props.states}
                      data={model.state}
                    />
                    <SubmissionFor form={form} data={model.zipCode} span={4} />
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row type="flex">
              <Col xl={10} lg={14} sm={24}>
                <Card title="Source Info">
                  <Row type="flex">
                    <SubmissionFor
                      form={form}
                      data={model.source}
                      selectOptions={this.props.sources}
                    />
                    <SubmissionFor form={form} data={model.startDate} />
                  </Row>
                  <Row type="flex">
                    <SubmissionFor
                      form={form}
                      data={model.sourceNotes}
                      span={24}
                    />
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row type="flex">
              <Col xl={10} lg={14} sm={24}>
                <Card title="Client Rates">
                  <Row type="flex">
                    <EditableFor
                      editing={this.props.isAdmin}
                      form={form}
                      data={model.fullHour}
                    />
                  </Row>
                  <Row type="flex">
                    <EditableFor
                      editing={this.props.isAdmin}
                      form={form}
                      data={model.fullHourTenPack}
                    />
                  </Row>
                  <Row type="flex">
                    <EditableFor
                      editing={this.props.isAdmin}
                      form={form}
                      data={model.halfHour}
                    />
                  </Row>
                  <Row type="flex">
                    <EditableFor
                      editing={this.props.isAdmin}
                      form={form}
                      data={model.halfHourTenPack}
                    />
                  </Row>
                  <Row type="flex">
                    <EditableFor
                      editing={this.props.isAdmin}
                      form={form}
                      data={model.pair}
                    />
                  </Row>
                  <Row type="flex">
                    <EditableFor
                      editing={this.props.isAdmin}
                      form={form}
                      data={model.pairTenPack}
                    />
                  </Row>
                  <Row type="flex">
                    <EditableFor
                      editing={this.props.isAdmin}
                      form={form}
                      data={model.halfHourPair}
                    />
                  </Row>
                  <Row type="flex">
                    <EditableFor
                      editing={this.props.isAdmin}
                      form={form}
                      data={model.halfHourPairTenPack}
                    />
                  </Row>
                  <Row type="flex">
                    <EditableFor
                      editing={this.props.isAdmin}
                      form={form}
                      data={model.fullHourGroup}
                    />
                  </Row>
                  <Row type="flex">
                    <EditableFor
                      editing={this.props.isAdmin}
                      form={form}
                      data={model.fullHourGroupTenPack}
                    />
                  </Row>
                  <Row type="flex">
                    <EditableFor
                      editing={this.props.isAdmin}
                      form={form}
                      data={model.halfHourGroup}
                    />
                  </Row>
                  <Row type="flex">
                    <EditableFor
                      editing={this.props.isAdmin}
                      form={form}
                      data={model.halfHourGroupTenPack}
                    />
                  </Row>
                  <Row type="flex">
                    <EditableFor
                      editing={this.props.isAdmin}
                      form={form}
                      data={model.fortyFiveMinute}
                    />
                  </Row>
                  <Row type="flex">
                    <EditableFor
                      editing={this.props.isAdmin}
                      form={form}
                      data={model.fortyFiveMinuteTenPack}
                    />
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row type="flex" style={{ margin: '24px 0' }}>
              <SubmissionFor form={form} data={model.addClientToCreator} />
            </Row>
            <Row type="flex" style={{ margin: '24px 0' }}>
              <Col span={4}>
                <button type="submit" className="form__footer__button">
                  Submit
                </button>
                <button
                  type="reset"
                  onClick={() => browserHistory.push('/clients')}
                  className="form__footer__button"
                >
                  Cancel
                </button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

ClientFormInner.propTypes = {
  model: PropTypes.object,
  addClient: PropTypes.func,
  states: PropTypes.array,
  form: PropTypes.object,
  sources: PropTypes.array,
  isAdmin: PropTypes.bool,
  defaultClientRates: PropTypes.object,
};

const ClientForm = props => {
  let Inner = Form.create({
    mapPropsToFields: p =>
      Object.keys(p.model)
        .map(x => Form.createFormField(p.model[x]))
        .reduce((acc, item) => {
          acc[item.name] = item;
          return acc;
        }, {}),
  })(ClientFormInner);
  return <Inner {...props} />;
};

ClientForm.propTypes = {
  model: PropTypes.object,
  addClient: PropTypes.func,
  states: PropTypes.array,
  sources: PropTypes.array,
  isAdmin: PropTypes.bool,
  defaultClientRates: PropTypes.object,
};

export default ClientForm;
