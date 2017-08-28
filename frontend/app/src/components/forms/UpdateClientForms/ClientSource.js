import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditableFor from '../../formElements/EditableFor';
import { Form, Card, Row } from 'antd';
import EDFooter from './../EDFooter';

const ClientSourceInner = ({model,
                             form,
                             toggleEdit,
                             submit,
                             editing,
                             sources
                           }) => {

  const handleSubmit = (e) => {
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
        <EditableFor form={form} data={model.clientId} hidden={true} />
        <Row type="flex">
          <EditableFor
            editing={editing}
            form={form}
            data={model.source}

            selectOptions={sources}
          />
          <EditableFor editing={editing} form={form} data={model.startDate} />
        </Row>
        <EDFooter editing={editing} toggleEdit={toggleEdit} />
      </Form>
    </Card>
  );
};

ClientSourceInner.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  sources: PropTypes.array,
  submit: PropTypes.func,
  editing: PropTypes.bool,
  toggleEdit: PropTypes.func
};

class ClientSource extends Component {
  state = {editing: false};

  toggleEdit = (e) => {
    e.preventDefault();
    this.setState({editing: !this.state.editing});
  };

  render() {
    let Inner = Form.create({mapPropsToFields: (props) => ({...props.model})})(ClientSourceInner);
    return (<Inner {...this.props} editing={this.state.editing} toggleEdit={this.toggleEdit} />);
  }
}

ClientSource.propTypes = {
  form: PropTypes.object,
  model: PropTypes.object,
  submit: PropTypes.func
};

export default ClientSource;
