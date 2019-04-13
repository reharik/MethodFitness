import ContentHeader from '../ContentHeader';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SubmissionFor from './../formElements/SubmissionFor';
import prices from './../../utilities/prices';
import { Form, Card, Row, Col } from 'antd';
import { Notifs } from 'redux-notifications';
import { browserHistory } from 'react-router';

class PurchaseForm extends Component {
  state = {
    fullHourTenPackTotal: 0,
    fullHourTotal: 0,
    halfHourTenPackTotal: 0,
    halfHourTotal: 0,
    pairTenPackTotal: 0,
    pairTotal: 0,
    purchaseTotal: 0,
  };

  onSubmitHandler = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const fieldValues = {
          ...values,
          ...this.purchasePrice(values),
        };
        Object.keys(values).forEach(x => {
          if (this.props.model[x].type === 'number' && !fieldValues[x]) {
            fieldValues[x] = 0;
          }
        });
        fieldValues.clientId = this.props.params.clientId;
        this.props.purchase(fieldValues);
        console.log('Received values of form: ', values);
      }
    });
  };

  changeHandler = field => value =>
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values[field] = value;
        const totals = this.purchasePrice(values);
        this.setState({ ...totals });
      }
    });

  purchasePrice = fields => {
    let purchase = {
      fullHourTotal: (fields.fullHour || 0) * prices.fullHour,
      fullHourTenPackTotal:
        (fields.fullHourTenPack || 0) * prices.fullHourTenPack,
      halfHourTotal: (fields.halfHour || 0) * prices.halfHour,
      halfHourTenPackTotal:
        (fields.halfHourTenPack || 0) * prices.halfHourTenPack,
      pairTotal: (fields.pair || 0) * prices.pair,
      pairTenPackTotal: (fields.pairTenPack || 0) * prices.pairTenPack,
    };
    purchase.purchaseTotal =
      purchase.fullHourTotal +
      purchase.fullHourTenPackTotal +
      purchase.halfHourTotal +
      purchase.halfHourTenPackTotal +
      purchase.pairTotal +
      purchase.pairTenPackTotal;
    return purchase;
  };

  render() {
    const model = this.props.model;
    const form = this.props.form;
    return (
      <div className="form">
        <ContentHeader>
          <div className="form__header">
            <div className="form__header__left" />
            <div className="form__header__center">
              <div className="form__header__center__title">
                Purchase Information for{' '}
                {`${this.props.client.contact.firstName} ${
                  this.props.client.contact.lastName
                }`}
              </div>
            </div>
            <div className="form__header__right">
              <button
                className="contentHeader__button"
                onClick={() =>
                  browserHistory.push(
                    `/purchases/${this.props.params.clientId}`,
                  )
                }
              >
                Return to Purchases
              </button>
            </div>
          </div>
        </ContentHeader>
        <Notifs containerName="PurchaseForm" />
        <div className="form-scroll-inner">
          <Form
            onSubmit={this.onSubmitHandler}
            className="form__content"
            layout="vertical"
          >
            <Row type="flex">
              <Col xl={10} lg={14} sm={24}>
                <Card title="Client Info">
                  <Row type="flex">
                    <SubmissionFor
                      form={form}
                      data={model.fullHour}
                      onChange={this.changeHandler('fullHour')}
                      span={8}
                    />
                    <div
                      style={{
                        paddingTop: '8px',
                      }}
                    >
                      ${this.state.fullHourTotal.toFixed(2)}
                    </div>
                  </Row>
                  <Row type="flex">
                    <SubmissionFor
                      form={form}
                      data={model.fullHourTenPack}
                      onChange={this.changeHandler('fullHourTenPack')}
                      span={8}
                    />
                    <div
                      style={{
                        paddingTop: '8px',
                      }}
                    >
                      ${this.state.fullHourTenPackTotal.toFixed(2)}
                    </div>
                  </Row>
                  <Row type="flex">
                    <SubmissionFor
                      form={form}
                      data={model.halfHour}
                      onChange={this.changeHandler('halfHour')}
                      span={8}
                    />
                    <div
                      style={{
                        paddingTop: '8px',
                      }}
                    >
                      ${this.state.halfHourTotal.toFixed(2)}
                    </div>
                  </Row>
                  <Row type="flex">
                    <SubmissionFor
                      form={form}
                      data={model.halfHourTenPack}
                      onChange={this.changeHandler('halfHourTenPack')}
                      span={8}
                    />
                    <div
                      style={{
                        paddingTop: '8px',
                      }}
                    >
                      ${this.state.halfHourTenPackTotal.toFixed(2)}
                    </div>
                  </Row>
                  <Row type="flex">
                    <SubmissionFor
                      form={form}
                      data={model.pair}
                      onChange={this.changeHandler('pair')}
                      span={8}
                    />
                    <div
                      style={{
                        paddingTop: '8px',
                      }}
                    >
                      ${this.state.pairTotal.toFixed(2)}
                    </div>
                  </Row>
                  <Row type="flex">
                    <SubmissionFor
                      form={form}
                      data={model.pairTenPack}
                      onChange={this.changeHandler('pairTenPack')}
                      span={8}
                    />
                    <div
                      style={{
                        paddingTop: '8px',
                      }}
                    >
                      ${this.state.pairTenPackTotal.toFixed(2)}
                    </div>
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row type="flex">
              <Col xl={10} lg={14} sm={24}>
                <Card
                  data-id={'purchaseTotal'}
                  title={`Purchase Total: $${this.state.purchaseTotal.toFixed(
                    2,
                  )}`}
                >
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.notes} />
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row type="flex" style={{ margin: '24px 0' }}>
              <Col span={4}>
                <button type="submit" className="form__footer__button">
                  Save
                </button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

PurchaseForm.propTypes = {
  model: PropTypes.object,
  form: PropTypes.object,
  params: PropTypes.object,
  fetchClientAction: PropTypes.func,
  notifications: PropTypes.func,
  client: PropTypes.object,
  purchase: PropTypes.func,
};

export default Form.create()(PurchaseForm);
