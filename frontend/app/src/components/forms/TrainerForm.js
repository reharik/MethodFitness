import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Notifs } from 'redux-notifications';
import ContentHeader from '../ContentHeader';
import SubmissionFor from './../formElements/SubmissionFor';
import { browserHistory } from 'react-router';
import { Form, Card, Row, Col } from 'antd';
import EditableFor from './../formElements/EditableFor';

class TrainerForm extends Component {
  componentDidMount() {
    this.loadData();
  }

  loadData() {
    if (this.props.params.trainerId) {
      this.props.fetchTrainerAction(this.props.params.trainerId);
    }
    this.props.fetchClientsAction();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // debugger; //eslint-disable-line
        values.trainerClientRates = values.clients.map(x => {
          const rate = {
            clientId: x,
            rate: values[x],
          };
          delete values[x];
          return rate;
        });
        this.props.hireTrainer(values);
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const model = this.props.model;
    const form = this.props.form;
    model.trainerClientRates.listItems = (
      form.getFieldValue('clients') || []
    ).map(x => {
      const exists = model.trainerClientRates.listItems.find(
        li => li.clientId === x,
      );
      if (exists) {
        return exists;
      }
      let client = this.props.clientsInfo.find(c => c.clientId === x);
      return {
        value: model.defaultTrainerClientRate.value,
        label: `${client.contact.lastName}, ${client.contact.firstName}`,
        name: x,
        rules: [{ required: true, message: 'Rate is required' }],
      };
    });
    console.log(`==========model.trainerClientRates=========`);
    console.log(form.getFieldValue('clients'));
    console.log(model.trainerClientRates);
    console.log(`==========END model.trainerClientRates=========`);

    return (
      <div className="form">
        <ContentHeader>
          <div className="form__header">
            <div className="form__header__left">
              <button
                className="contentHeader__button__new"
                title="New"
                onClick={() => {
                  form.resetFields();
                  browserHistory.push('/trainer');
                }}
              />
            </div>
            <div className="form__header__center">
              <div className="form__header__center__title">Trainer</div>
            </div>
            <div className="form__header__right" />
          </div>
        </ContentHeader>
        <Notifs containerName="trainerForm" />
        <div className="form-scroll-inner">
          <Form
            onSubmit={this.handleSubmit}
            className="form__content"
            layout="vertical"
          >
            <Row type="flex">
              <Col xl={10} lg={14} sm={24}>
                <Card title="Contact Info">
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.firstName} />
                    <SubmissionFor form={form} data={model.lastName} />
                  </Row>
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.mobilePhone} />
                    <SubmissionFor form={form} data={model.secondaryPhone} />
                  </Row>
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.email} />
                  </Row>
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.street1} />
                    <SubmissionFor form={form} data={model.street2} />
                  </Row>
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.city} />
                    <SubmissionFor
                      selectOptions={this.props.states}
                      form={form}
                      data={model.state}
                      span={8}
                    />
                    <SubmissionFor form={form} data={model.zipCode} span={4} />
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row type="flex">
              <Col xl={10} lg={14} sm={24}>
                <Card title="Trainer Info">
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.birthDate} />
                    {/*<SubmissionFor form={form} data={model.defaultClientRate} />*/}
                    <SubmissionFor form={form} data={model.color} />
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row type="flex">
              <Col xl={10} lg={14} sm={24}>
                <Card title="Trainer Credentials">
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.password} />
                  </Row>
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.confirmPassword} />
                  </Row>
                  <Row type="flex">
                    <SubmissionFor
                      selectOptions={this.props.roles}
                      form={form}
                      data={model.role}
                    />
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row type="flex">
              <Col xl={10} lg={14} sm={24}>
                <Card title="Trainer' Clients">
                  <Row type="flex">
                    <SubmissionFor
                      form={form}
                      data={model.defaultTrainerClientRate}
                    />
                  </Row>
                  <Row type="flex">
                    <EditableFor
                      editing={true}
                      form={form}
                      data={model.clients}
                      // onChange={e => {
                      //   console.log(`==========e=========`);
                      //   console.log(e);
                      //   console.log(`==========END e=========`);
                      // }}
                      selectOptions={this.props.clients}
                    />
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row type="flex">
              <Col xl={10} lg={14} sm={24}>
                <Card
                  title={`Trainer's Client Rate`}
                  data-id={'trainerClientRate'}
                >
                  {model.trainerClientRates.listItems.map(x => {
                    return (
                      <Row type="flex" key={x.name}>
                        <EditableFor
                          align={'center'}
                          // formItemLayout={formItemLayout}
                          key={x.name}
                          editing={true}
                          form={form}
                          data={x}
                          span={16}
                        />
                      </Row>
                    );
                  })}
                </Card>
              </Col>
            </Row>

            <Row type="flex">
              <div className="form__footer">
                <button type="submit" className="form__footer__button">
                  Submit
                </button>
                <button
                  type="reset"
                  onClick={() => browserHistory.push('/trainers')}
                  className="form__footer__button"
                >
                  Cancel
                </button>
              </div>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

TrainerForm.propTypes = {
  params: PropTypes.object,
  form: PropTypes.object,
  model: PropTypes.object,
  fetchTrainerAction: PropTypes.func,
  fetchClientsAction: PropTypes.func,
  hireTrainer: PropTypes.func,
  states: PropTypes.array,
  roles: PropTypes.array,
  clients: PropTypes.array,
  clientsInfo: PropTypes.array,
};

export default Form.create({
  mapPropsToFields: props =>
    Object.keys(props.model)
      .map(x => Form.createFormField(props.model[x]))
      .reduce((acc, item) => {
        acc[item.name] = item;
        return acc;
      }, {}),
})(TrainerForm);
