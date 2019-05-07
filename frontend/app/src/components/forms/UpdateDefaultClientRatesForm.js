import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Notifs } from 'redux-notifications';
import ContentHeader from '../ContentHeader';
import SubmissionFor from './../formElements/SubmissionFor';
import { Form, Card, Row, Col } from 'antd';
import EditableFor from '../formElements/EditableFor';

class UpdateDefaultClientRatesFormInner extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.updateDefaultClientRates(values);
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const model = this.props.model;
    const form = this.props.form;
    console.log(`==========model.defaultClientRatesId==========`);
    console.log(model.fullHour);
    console.log(`==========END model.defaultClientRatesId==========`);

    return (
      <div className="form">
        <ContentHeader>
          <div className="form__header">
            <div className="form__header__left" />
            <div className="form__header__center">
              <div className="form__header__center__title">
                Default Client Rates
              </div>
            </div>
            <div className="form__header__right" />
          </div>
        </ContentHeader>
        <Notifs containerName="defaultClientRatesForm" />
        <div className="form-scroll-inner">
          <Form
            onSubmit={this.handleSubmit}
            className="form__content"
            layout="vertical"
          >
            <Row type="flex">
              <Col xl={10} lg={14} sm={24}>
                <Card title="Default Client Rates">
                  <Row type="flex">
                    <EditableFor
                      form={form}
                      data={model.defaultClientRatesId}
                      hidden={true}
                    />
                    <SubmissionFor form={form} data={model.fullHour} />
                    <SubmissionFor form={form} data={model.fullHourTenPack} />
                    <SubmissionFor form={form} data={model.halfHour} />
                    <SubmissionFor form={form} data={model.halfHourTenPack} />
                    <SubmissionFor form={form} data={model.pair} />
                    <SubmissionFor form={form} data={model.pairTenPack} />
                    <SubmissionFor form={form} data={model.halfHourPair} />
                    <SubmissionFor
                      form={form}
                      data={model.halfHourPairTenPack}
                    />
                    <SubmissionFor form={form} data={model.fullHourGroup} />
                    <SubmissionFor
                      form={form}
                      data={model.fullHourGroupTenPack}
                    />
                    <SubmissionFor form={form} data={model.halfHourGroup} />
                    <SubmissionFor
                      form={form}
                      data={model.halfHourGroupTenPack}
                    />
                    <SubmissionFor form={form} data={model.fortyFiveMinute} />
                    <SubmissionFor
                      form={form}
                      data={model.fortyFiveMinuteTenPack}
                    />
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row type="flex" style={{ margin: '24px 0' }}>
              <Col span={4}>
                <button type="submit" className="form__footer__button">
                  Submit
                </button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

UpdateDefaultClientRatesFormInner.propTypes = {
  model: PropTypes.object,
  updateDefaultClientRates: PropTypes.func,
  notifications: PropTypes.func,
  form: PropTypes.object,
};

const UpdateDefaultClientRatesForm = props => {
  let Inner = Form.create({
    mapPropsToFields: p =>
      Object.keys(p.model)
        .map(x => Form.createFormField(p.model[x]))
        .reduce((acc, item) => {
          acc[item.name] = item;
          return acc;
        }, {}),
  })(UpdateDefaultClientRatesFormInner);
  return <Inner {...props} />;
};

UpdateDefaultClientRatesForm.propTypes = {
  model: PropTypes.object,
  updateDefaultClientRates: PropTypes.func,
  notifications: PropTypes.func,
  form: PropTypes.object,
};

export default UpdateDefaultClientRatesForm;
