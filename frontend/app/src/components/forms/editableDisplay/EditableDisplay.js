import React, { PropTypes, Component } from 'react';
import {Notifs} from 'redux-notifications';
import {Form} from 'freakin-react-forms';
import EDFooter from './EDFooter.js';

class EditableDisplay extends Component {

  componentWillMount() {
    const fields = Form.buildModel(this.props.formName, this.props.model, {onChange: this.changeHandler});
    const relevantFields = this.getRelevantFieldsFromModel(this.props.children, fields);

    this.setState({fields: relevantFields, formIsValid: false, editing: false});
  }

  componentWillReceiveProps(newProps) {
    if(!this.state.editing) {
        const fields = Form.buildModel(newProps.formName, newProps.model, {onChange: this.changeHandler});
        const relevantFields = this.getRelevantFieldsFromModel(this.props.children, fields);
        this.setState({fields:relevantFields});
    }
  }

  toggleEdit = (e,rollBack) => {
    e.preventDefault();
    if (rollBack) {
      this.props.notifications([], this.props.formName);
      const fields = Form.buildModel(this.props.formName, this.props.model, {onChange: this.changeHandler});
      this.setState({fields, editing: !this.state.editing});
    }else {
      this.setState({
        editing: !this.state.editing
      })
    }
  };

  getRelevantFieldsFromModel = (children, model)  => {
    let result = {};
    let it = (children) => {
      React.Children.forEach(children, x => {
        if (x.props) {
          if (x.props.data) {
            result[x.props.data] = model[x.props.data];
          } else {
            it(x.props.children)
          }
        }
      });
    };
    it(children);
    result.id = model.id;
    return result;
  };

  setEditing = (children, editing, fields) => {
    return React.Children.map(children, x => {
      if (!x.props) {
        return x;
      }
      if (x.props.data) {
        const data = fields[x.props.data];
        if(x.props.bindChange){
          return React.cloneElement(x, {editing, data:data, onChange: x.props.bindChange.bind(this)});
        }
        return React.cloneElement(x, {editing, data:data});
      }
      let clonedItems = this.setEditing(x.props.children, editing, fields);
      return React.cloneElement(x, {children: clonedItems});
    });
  };

  changeHandler = (e) => {

    const result = Form.onChangeHandler(this.state.fields)(e);
    this.props.notifications(result.errors, this.props.formName, e.target.name);
    this.setState(result);
  };

  submitHandler = (e) => {
    e.preventDefault();
    let result;
    if (this.props.overrideSubmit) {
      result = this.props.submitHandler(this.state.fields)
    } else {
      result = Form.prepareSubmission(this.state.fields);

      if(result.formIsValid){
        this.props.submitHandler(result.fieldValues);
      }
    }
    this.props.notifications(result.errors, this.props.formName);

    this.setState({...result, editing: !result.formIsValid});
  };

  deleteAppointment = () => {
    this.props.deleteAppointment(this.state.fields.id)
  };

  render() {
    return (
      <div className="editableDisplay">
        <div className="editableDisplay__header">
          <label className="editableDisplay__header__label">{this.props.sectionHeader}</label>
        </div>
        <div className="editableDisplay___content">
          <Notifs containerName={this.props.formName}/>
          <form onSubmit={this.submitHandler} className="editableDisplay__content__form">
            {this.setEditing(this.props.children, this.state.editing, this.state.fields)}
            {this.props.footer
                ? <this.props.footer
              editing={this.state.editing}
              toggleEdit={this.toggleEdit}
              params={this.props.params} />
                : <EDFooter editing={this.state.editing} toggleEdit={this.toggleEdit}/>
            }
          </form>
        </div>
      </div>
    );
  }
}

export default EditableDisplay;
