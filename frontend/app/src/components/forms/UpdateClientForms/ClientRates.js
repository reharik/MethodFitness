import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditableFor from '../../formElements/EditableFor';
import { Form, Card, Row } from 'antd';
import EDFooter from './../EDFooter';

const ClientRatesInner = ({
  model,
  form,
  toggleEdit,
  submit,
  editing,
  isAdmin,
}) => {
  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        submit(values);
        console.log('Received values of form: ', values);
        toggleEdit(e);
      }
    });
  };

  return (
    <Card title={'Client Rates'} data-id={'clientRates'}>
      <Form onSubmit={handleSubmit} layout={'vertical'}>
        <EditableFor
          span={22}
          form={form}
          data={model.clientId}
          hidden={true}
        />
        <Row type="flex">
          <EditableFor
            span={22}
            editing={editing}
            form={form}
            data={model.fullHour}
          />
        </Row>
        <Row type="flex">
          <EditableFor
            span={22}
            editing={editing}
            form={form}
            data={model.fullHourTenPack}
          />
        </Row>
        <Row type="flex">
          <EditableFor
            span={22}
            editing={editing}
            form={form}
            data={model.halfHour}
          />
        </Row>
        <Row type="flex">
          <EditableFor
            span={22}
            editing={editing}
            form={form}
            data={model.halfHourTenPack}
          />
        </Row>
        <Row type="flex">
          <EditableFor
            span={22}
            editing={editing}
            form={form}
            data={model.pair}
          />
        </Row>
        <Row type="flex">
          <EditableFor
            span={22}
            editing={editing}
            form={form}
            data={model.pairTenPack}
          />
        </Row>
        <Row type="flex">
          <EditableFor
            span={22}
            editing={editing}
            form={form}
            data={model.halfHourPair}
          />
        </Row>
        <Row type="flex">
          <EditableFor
            span={22}
            editing={editing}
            form={form}
            data={model.halfHourPairTenPack}
          />
        </Row>
        <Row type="flex">
          <EditableFor
            span={22}
            editing={editing}
            form={form}
            data={model.fullHourGroup}
          />
        </Row>
        <Row type="flex">
          <EditableFor
            span={22}
            editing={editing}
            form={form}
            data={model.fullHourGroupTenPack}
          />
        </Row>
        <Row type="flex">
          <EditableFor
            span={22}
            editing={editing}
            form={form}
            data={model.halfHourGroup}
          />
        </Row>
        <Row type="flex">
          <EditableFor
            span={22}
            editing={editing}
            form={form}
            data={model.halfHourGroupTenPack}
          />
        </Row>
        <Row type="flex">
          <EditableFor
            span={22}
            editing={editing}
            form={form}
            data={model.fortyFiveMinute}
          />
        </Row>
        <Row type="flex">
          <EditableFor
            span={22}
            editing={editing}
            form={form}
            data={model.fortyFiveMinuteTenPack}
          />
        </Row>
        {isAdmin ? (
          <EDFooter editing={editing} toggleEdit={toggleEdit} />
        ) : null}
      </Form>
    </Card>
  );
};

ClientRatesInner.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  submit: PropTypes.func,
  editing: PropTypes.bool,
  toggleEdit: PropTypes.func,
  isAdmin: PropTypes.bool,
};

class ClientRates extends Component {
  state = { editing: false };

  toggleEdit = e => {
    e.preventDefault();
    this.setState({
      editing: !this.state.editing,
    });
  };

  render() {
    let Inner = Form.create({
      mapPropsToFields: props =>
        Object.keys(props.model)
          .map(x => Form.createFormField(props.model[x]))
          .reduce((acc, item) => {
            acc[item.name] = item;
            return acc;
          }, {}),
    })(ClientRatesInner);
    return (
      <Inner
        {...this.props}
        editing={this.state.editing}
        toggleEdit={this.toggleEdit}
      />
    );
  }
}

ClientRates.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  submit: PropTypes.func,
};

export default ClientRates;
