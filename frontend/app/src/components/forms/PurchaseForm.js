import ContentHeader from '../ContentHeader';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SubmissionFor from './../formElements/SubmissionFor';
import { Form, Card, Row, Col, Collapse } from 'antd';
import { Notifs } from 'redux-notifications';
import { browserHistory } from 'react-router';

const Panel = Collapse.Panel;

class PurchaseForm extends Component {
  state = {
    fullHourTenPackTotal: 0,
    fullHourTotal: 0,
    halfHourTenPackTotal: 0,
    halfHourTotal: 0,
    pairTenPackTotal: 0,
    pairTotal: 0,
    halfHourPairTenPackTotal: 0,
    halfHourPairTotal: 0,
    fullHourGroupTenPackTotal: 0,
    fullHourGroupTotal: 0,
    halfHourGroupTenPackTotal: 0,
    halfHourGroupTotal: 0,
    fortyFiveMinuteTenPackTotal: 0,
    fortyFiveMinuteTotal: 0,
    purchaseTotal: 0,
  };

  onSubmitHandler = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Object.keys(values).forEach(x => {
          if (this.props.model[x].type === 'number' && !values[x]) {
            values[x] = 0;
          }
        });
        values.clientId = this.props.params.clientId;
        this.props.purchase(values);
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
      fullHourTotal: (fields.fullHour || 0) * this.props.clientRates.fullHour,
      fullHourTenPackTotal:
        (fields.fullHourTenPack || 0) * this.props.clientRates.fullHourTenPack,
      halfHourTotal: (fields.halfHour || 0) * this.props.clientRates.halfHour,
      halfHourTenPackTotal:
        (fields.halfHourTenPack || 0) * this.props.clientRates.halfHourTenPack,
      pairTotal: (fields.pair || 0) * this.props.clientRates.pair,
      pairTenPackTotal:
        (fields.pairTenPack || 0) * this.props.clientRates.pairTenPack,
      halfHourPairTotal:
        (fields.halfHourPair || 0) * this.props.clientRates.halfHourPair,
      halfHourPairTenPackTotal:
        (fields.halfHourPairTenPack || 0) *
        this.props.clientRates.halfHourPairTenPack,
      fullHourGroupTotal:
        (fields.fullHourGroup || 0) * this.props.clientRates.fullHourGroup,
      fullHourGroupTenPackTotal:
        (fields.fullHourGroupTenPack || 0) *
        this.props.clientRates.fullHourGroupTenPack,
      halfHourGroupTotal:
        (fields.halfHourGroup || 0) * this.props.clientRates.halfHourGroup,
      halfHourGroupTenPackTotal:
        (fields.halfHourGroupTenPack || 0) *
        this.props.clientRates.halfHourGroupTenPack,
      fortyFiveMinuteTotal:
        (fields.fortyFiveMinute || 0) * this.props.clientRates.fortyFiveMinute,
      fortyFiveMinuteTenPackTotal:
        (fields.fortyFiveMinuteTenPack || 0) *
        this.props.clientRates.fortyFiveMinuteTenPack,
    };
    purchase.purchaseTotal =
      purchase.fullHourTotal +
      purchase.fullHourTenPackTotal +
      purchase.halfHourTotal +
      purchase.halfHourTenPackTotal +
      purchase.pairTotal +
      purchase.pairTenPackTotal +
      purchase.halfHourPairTotal +
      purchase.halfHourPairTenPackTotal +
      purchase.fullHourGroupTotal +
      purchase.fullHourGroupTenPackTotal +
      purchase.halfHourGroupTotal +
      purchase.halfHourGroupTenPackTotal +
      purchase.fortyFiveMinuteTotal +
      purchase.fortyFiveMinuteTenPackTotal;

    return purchase;
  };

  render() {
    const model = this.props.model;
    const form = this.props.form;
    console.log(`==========model==========`);
    console.log(model);
    console.log(`==========END model==========`);

    return (
      <div className="form">
        <ContentHeader>
          <div className="form__header">
            <div className="form__header__left" />
            <div className="form__header__center">
              <div className="form__header__center__title">
                Purchase Information for{' '}
                {`${this.props.clientFirstName} ${this.props.clientLastName}`}
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
            layout="horizontal"
            labelAlign="left"
            labelCol={{ span: 16 }}
            wrapperCol={{ span: 8 }}
          >
            <Row type="flex">
              <Col xl={14} lg={14} sm={24}>
                <Card title="Client Info">
                  <Collapse defaultActiveKey={['1']}>
                    <Panel header="Full Hours" key="1">
                      <Row type="flex" justify="start">
                        <SubmissionFor
                          form={form}
                          data={model.fullHour}
                          onChange={this.changeHandler('fullHour')}
                          span={14}
                        />
                        <div
                          style={{
                            padding: '8px 0 0 8px',
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
                          span={14}
                        />
                        <div
                          style={{
                            padding: '8px 0 0 8px',
                          }}
                        >
                          ${this.state.fullHourTenPackTotal.toFixed(2)}
                        </div>
                      </Row>
                    </Panel>
                    <Panel header="Half Hours" key="2">
                      <Row type="flex">
                        <SubmissionFor
                          form={form}
                          data={model.halfHour}
                          onChange={this.changeHandler('halfHour')}
                          span={14}
                        />
                        <div
                          style={{
                            padding: '8px 0 0 8px',
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
                          span={14}
                        />
                        <div
                          style={{
                            padding: '8px 0 0 8px',
                          }}
                        >
                          ${this.state.halfHourTenPackTotal.toFixed(2)}
                        </div>
                      </Row>
                    </Panel>
                    <Panel header="Pairs" key="3">
                      <Row type="flex">
                        <SubmissionFor
                          form={form}
                          data={model.pair}
                          onChange={this.changeHandler('pair')}
                          span={14}
                        />
                        <div
                          style={{
                            padding: '8px 0 0 8px',
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
                          span={14}
                        />
                        <div
                          style={{
                            padding: '8px 0 0 8px',
                          }}
                        >
                          ${this.state.pairTenPackTotal.toFixed(2)}
                        </div>
                      </Row>
                    </Panel>
                    <Panel header="Half Hour Pairs" key="4">
                      <Row type="flex">
                        <SubmissionFor
                          form={form}
                          data={model.halfHourPair}
                          onChange={this.changeHandler('halfHourPair')}
                          span={14}
                        />
                        <div
                          style={{
                            padding: '8px 0 0 8px',
                          }}
                        >
                          ${this.state.halfHourPairTotal.toFixed(2)}
                        </div>
                      </Row>
                      <Row type="flex">
                        <SubmissionFor
                          form={form}
                          data={model.halfHourPairTenPack}
                          onChange={this.changeHandler('halfHourPairTenPack')}
                          span={14}
                        />
                        <div
                          style={{
                            padding: '8px 0 0 8px',
                          }}
                        >
                          ${this.state.halfHourPairTenPackTotal.toFixed(2)}
                        </div>
                      </Row>
                    </Panel>
                    <Panel header="Full Hour Groups" key="5">
                      <Row type="flex">
                        <SubmissionFor
                          form={form}
                          data={model.fullHourGroup}
                          onChange={this.changeHandler('fullHourGroup')}
                          span={14}
                        />
                        <div
                          style={{
                            padding: '8px 0 0 8px',
                          }}
                        >
                          ${this.state.fullHourGroupTotal.toFixed(2)}
                        </div>
                      </Row>
                      <Row type="flex">
                        <SubmissionFor
                          form={form}
                          data={model.fullHourGroupTenPack}
                          onChange={this.changeHandler('fullHourGroupTenPack')}
                          span={14}
                        />
                        <div
                          style={{
                            padding: '8px 0 0 8px',
                          }}
                        >
                          ${this.state.fullHourGroupTenPackTotal.toFixed(2)}
                        </div>
                      </Row>
                    </Panel>
                    <Panel header="Half Hour Groups" key="6">
                      <Row type="flex">
                        <SubmissionFor
                          form={form}
                          data={model.halfHourGroup}
                          onChange={this.changeHandler('halfHourGroup')}
                          span={14}
                        />
                        <div
                          style={{
                            padding: '8px 0 0 8px',
                          }}
                        >
                          ${this.state.halfHourGroupTotal.toFixed(2)}
                        </div>
                      </Row>
                      <Row type="flex">
                        <SubmissionFor
                          form={form}
                          data={model.halfHourGroupTenPack}
                          onChange={this.changeHandler('halfHourGroupTenPack')}
                          span={14}
                        />
                        <div
                          style={{
                            padding: '8px 0 0 8px',
                          }}
                        >
                          ${this.state.halfHourGroupTenPackTotal.toFixed(2)}
                        </div>
                      </Row>
                    </Panel>
                    <Panel header="Forty Five Minute Sessions" key="7">
                      <Row type="flex">
                        <SubmissionFor
                          form={form}
                          data={model.fortyFiveMinute}
                          onChange={this.changeHandler('fortyFiveMinute')}
                          span={14}
                        />
                        <div
                          style={{
                            padding: '8px 0 0 8px',
                          }}
                        >
                          ${this.state.fortyFiveMinuteTotal.toFixed(2)}
                        </div>
                      </Row>
                      <Row type="flex">
                        <SubmissionFor
                          form={form}
                          data={model.fortyFiveMinuteTenPack}
                          onChange={this.changeHandler(
                            'fortyFiveMinuteTenPack',
                          )}
                          span={14}
                        />
                        <div
                          style={{
                            padding: '8px 0 0 8px',
                          }}
                        >
                          ${this.state.fortyFiveMinuteTenPackTotal.toFixed(2)}
                        </div>
                      </Row>
                    </Panel>
                  </Collapse>
                </Card>
              </Col>
            </Row>
            <Row type="flex">
              <Col xl={14} lg={14} sm={24}>
                <Card
                  data-id={'purchaseTotal'}
                  title={`Purchase Total: $${this.state.purchaseTotal.toFixed(
                    2,
                  )}`}
                >
                  <Row type="flex">
                    <SubmissionFor form={form} data={model.notes} span={20} />
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
  purchase: PropTypes.func,
  clientFirstName: PropTypes.string,
  clientLastName: PropTypes.string,
  clientRates: PropTypes.object,
};

export default Form.create()(PurchaseForm);
