import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentHeader from '../ContentHeader';
import { browserHistory } from 'react-router';
import EditableFor from '../formElements/EditableFor';
import { Form, Card, Row, Col } from 'antd';
import EDFooter from './EDFooter';

const LocationUpdateInner = ({ model, form, toggleEdit, submit, editing }) => {
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
    <Card title={'Source Info'}>
      <Form onSubmit={handleSubmit}>
        <EditableFor form={form} data={model.locationId} hidden={true} />
        <Row type="flex">
          <EditableFor editing={editing} form={form} data={model.name} />
        </Row>
        <EDFooter editing={editing} toggleEdit={toggleEdit} />
      </Form>
    </Card>
  );
};

LocationUpdateInner.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  sources: PropTypes.array,
  submit: PropTypes.func,
  editing: PropTypes.bool,
  toggleEdit: PropTypes.func,
};

class LocationUpdate extends Component {
  state = { editing: false };

  toggleEdit = e => {
    e.preventDefault();
    this.setState({
      editing: !this.state.editing,
    });
  };

  render() {
    let Inner = Form.create({
      mapPropsToFields: props => ({
        ...props.model,
      }),
    })(LocationUpdateInner);
    return (
      <Inner
        {...this.props}
        editing={this.state.editing}
        toggleEdit={this.toggleEdit}
      />
    );
  }
}

LocationUpdate.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  submit: PropTypes.func,
};

class Location extends Component {
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
                onClick={() => browserHistory.push('/location')}
              />
            </div>
            <div className="form__header__center">
              <div className="form__header__center__title">Location</div>
            </div>
            <div className="form__header__right" />
          </div>
        </ContentHeader>
        <div className="form-scroll-inner">
          <Row type="flex">
            <Col xl={10} lg={14} sm={24}>
              <LocationUpdate
                model={model}
                submit={this.props.updateLocationUpdate}
                sources={this.props.sources}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

Location.propTypes = {
  locationId: PropTypes.string,
  model: PropTypes.object,
  inventory: PropTypes.object,
  notifications: PropTypes.func,
  states: PropTypes.array,
  sources: PropTypes.array,
  fetchLocationAction: PropTypes.func,
  updateLocationUpdate: PropTypes.func,
  updateLocationInfo: PropTypes.func,
  updateLocationContact: PropTypes.func,
  updateLocationAddress: PropTypes.func,
};

export default Location;
